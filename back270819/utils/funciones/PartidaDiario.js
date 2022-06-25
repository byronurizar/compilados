const moment = require('moment');
const { PeriodoContable, PartidaContable, PartidaContableDetalle, TipoContraParte, ContraParte, ContraParteDetalle, CuentaBancaria, CuentaContable } = require('../../store/db');
const BancoTransaccion = require('./BancoTransaccion');
const Registrar = async (transaction, partida, usuario_crea, empresaId) => {
    let response = {};
    try {
        const { detalle, observaciones, fecha } = partida;
        if (detalle.length > 0) {
            let cuadrePartida = 0;
            let idPeriodoContable = 0;
            let totalDebe = 0;
            let totalHaber = 0;
            let anioActual = moment(new Date()).format('YYYY');

            let infoCuentaBancaria = await CuentaBancaria.findAll({
                where: { empresaId, cuenta_principal: true, estadoId: 1 },
                attributes: ['cuenta_bancariaId'],
                transaction
            });


            if (infoCuentaBancaria.length <= 0) {
                response.code = -1;
                response.data = "No existen cuentas bancarias asociadas a la empresa, por favor verifique";
                return response;
            }

            if (infoCuentaBancaria.length > 1) {
                response.code = -1;
                response.data = "Existe más de una cuenta bancaria con el flag cuenta principal, por favor verifique";
                return response;
            }


            let itemPeriodoContable = await PeriodoContable.findOne({
                where: { descripcion: anioActual },
                attributes: ['periodo_contableId'],
                transaction
            });

            if (itemPeriodoContable) {
                let { periodo_contableId = 0 } = itemPeriodoContable;
                idPeriodoContable = periodo_contableId;
            }

            if (idPeriodoContable <= 0) {
                let infoPeriodo = {
                    descripcion: anioActual,
                    usuario_crea
                };
                let insertPeriodoContable = await PeriodoContable.create(infoPeriodo, { transaction });
                if (insertPeriodoContable) {
                    let { periodo_contableId = 0 } = insertPeriodoContable;
                    idPeriodoContable = periodo_contableId;
                } else {
                    response.code = -1;
                    response.data = "No se logró crear el periodo contable, por favor comuníquese con el administrador del sistema";
                    return response;
                }
            }

            if (idPeriodoContable > 0) {

                let numero_partida = 1;
                let itemPartida = await PartidaContable.findOne({
                    where: { periodo_contableId: idPeriodoContable, empresaId },
                    attributes: ['partida_contableId', 'numero_partida'],
                    order: [
                        ['numero_partida', 'DESC']
                    ],
                    transaction
                });

                if (itemPartida) {
                    let { numero_partida: ultimaPartida = 0 } = itemPartida;
                    numero_partida = Number(ultimaPartida) + 1;
                }

                if (Number(numero_partida) > 0) {
                    let infoPartida = {
                        periodo_contableId: idPeriodoContable,
                        numero_partida,
                        usuario_crea,
                        observaciones,
                        fecha,
                        empresaId
                    };
                    let nuevaPartida = await PartidaContable.create(infoPartida, { transaction });
                    if (nuevaPartida) {
                        let { partida_contableId } = nuevaPartida;
                        for await (let { cuenta_contableId, contraparte = undefined, monto } of detalle) {
                            let idContraparte = undefined;
                            let totalContraparte = 0;

                            let itemCuenta = await CuentaContable.findOne({
                                where: { cuenta_contableId, empresaId },
                                attributes: ['cuenta_contableId', 'nombre', 'saldo', 'saldo_negativo','tipo_contraparteId'],
                                transaction
                            });

                            if (!itemCuenta) {
                                response.code = -1;
                                response.data = `Ocurrió un error al registrar la partida, la cuenta ${cuenta_contableId} no existe.`;
                                return response;
                            }

                            let { nombre, saldo, saldo_negativo,tipo_contraparteId=undefined } = itemCuenta;
                            let resulUpdateCuenta = await CuentaContable.update({
                                saldo: Number.parseFloat(saldo) + Number.parseFloat(monto)
                            }, {
                                where: {
                                    cuenta_contableId, empresaId
                                },
                                transaction
                            });

                            if (resulUpdateCuenta <= 0) {
                                response.code = -1;
                                response.data = `Ocurrió un error al actualizar el saldo de la cuenta ${nombre}`;
                                return response;
                            }
                            if(tipo_contraparteId>0){
                                if(!contraparte){
                                    response.code = -1;
                                    response.data = `La cuenta ${nombre} necesita contraparte, por favor verifique`;
                                    return response;
                                }
                            }

                            if (contraparte) {
                                let { detalle: detalleContraparte } = contraparte;
                                let itemTipoContraparte = await TipoContraParte.findOne({
                                    where: { tipo_contraparteId, estadoId: [1] },
                                    attributes: ['tipo_contraparteId'],
                                    transaction
                                });

                                if (!itemTipoContraparte) {
                                    response.code = -1;
                                    response.data = `El tipo de contraparte de la cuenta ${nombre}  no existe por favor verifique`;
                                    return response;
                                } else {
                                    let insertContraparte = await ContraParte.create({ tipo_contraparteId, estadoId: 1, usuario_crea }, { transaction });
                                    if (!insertContraparte) {
                                        response.code = -1;
                                        response.data = "Ocurrió un error al insertar la contraparte, por favor comuniquese con soporte";
                                        return response;
                                    } else {
                                        let { contraparteId } = insertContraparte;
                                        idContraparte = contraparteId;

                                        for await (let itemDetalle of detalleContraparte) {
                                            totalContraparte += Number.parseFloat(itemDetalle.monto);
                                            itemDetalle.contraparteId = idContraparte;
                                            itemDetalle.estadoId = 1;
                                            itemDetalle.usuario_crea = usuario_crea;
                                            if (Number(tipo_contraparteId) === Number(3)) {
                                                let [dataCuentaBanco] = infoCuentaBancaria
                                                let { cuenta_bancariaId } = dataCuentaBanco;
                                                if (Number(itemDetalle.llaveId) > 0) {
                                                    cuenta_bancariaId = itemDetalle.llaveId;
                                                }
                                                let dataTran = {
                                                    cuenta_bancariaId,
                                                    descripcion: '',
                                                    partida_contableId,
                                                    monto: Number.parseFloat(itemDetalle.monto),
                                                    referencia: ''
                                                }
                                                let resultTrans = await BancoTransaccion.Registrar(transaction, dataTran, usuario_crea, empresaId);
                                                if (resultTrans.code !== 1) {
                                                    return resultTrans;
                                                }
                                            }

                                            await ContraParteDetalle.create(itemDetalle, { transaction });
                                        }
                                    }
                                }


                                if (Number.parseFloat(monto) != Number.parseFloat(totalContraparte)) {
                                    response.code = -1;
                                    response.data = "El monto total de detalle de la contraparte no es igual al monto de la transacción";
                                    return response;
                                }
                            }
                            let itemDetalle = {
                                partida_contableId,
                                cuenta_contableId,
                                contraparteId: idContraparte,
                                monto: Number.parseFloat(monto),
                                usuario_crea
                            };
                            cuadrePartida += Number.parseFloat(monto);

                            if (Number(monto) > 0) {
                                totalDebe += Number.parseFloat(monto);
                            }

                            if (Number(monto) < 0) {
                                totalHaber += Number.parseFloat(monto);
                            }
                            await PartidaContableDetalle.create(itemDetalle, { transaction });

                        }

                        if (Math.abs(Number(totalDebe).toFixed(2)) === Math.abs(Number(totalHaber).toFixed(2))) {
                            response.code = 1;
                            response.data = nuevaPartida;
                            return response;
                        } else {
                            response.code = -1;
                            response.data = "La partida no cuadra, la diferencia entre DEBE y HABER es " + cuadrePartida.toFixed(2);
                            return response;
                        }

                    } else {
                        response.code = -1;
                        response.data = "No se logró crear la partida contable, por favor comuníquese con el administrador del sistema";
                        return response;
                    }
                }
            } else {
                response.code = 0;
                response.data = "No se logró obtener el código del periodo contable";
                return response;
            }
        } else {
            response.code = 0;
            response.data = "No fue posible registrar la partida ya que no existe un detalle";
            return response;
        }
    } catch (error) {
        response.code = -1;
        response.data = "Ocurrió un error al registrar la información contable, por favor comuniquese con soporte";
        if (error) {
            throw new Error(error);
        }
        return response;
    }
}

module.exports = {
    Registrar
}