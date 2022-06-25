const moment = require('moment');
const { PeriodoContable, PartidaContable, PartidaContableDetalle, TipoContraParte, TipoComprobante, ControlComprobante, ControlComprobanteDetalle } = require('../../store/db');
const Registrar = async (transaction, partida, usuario_crea) => {
    let response = {};
    try {
        const { detalle, observaciones } = partida;
        if (detalle.length > 0) {
            let cuadrePartida = 0;
            let idPeriodoContable = 0;
            let anioActual = moment(new Date()).format('YYYY');

            let itemPeriodoContable = await PeriodoContable.findOne({
                where: { descripcion: anioActual },
                attributes: ['periodo_contableId']
            }, { transaction });

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
                    where: { periodo_contableId: idPeriodoContable },
                    attributes: ['partida_contableId', 'numero_partida'],
                    order: [
                        ['numero_partida', 'DESC']
                    ]
                }, { transaction });

                if (itemPartida) {
                    let { numero_partida: ultimaPartida = 0 } = itemPartida;
                    numero_partida = Number(ultimaPartida) + 1;
                }

                if (Number(numero_partida) > 0) {
                    let infoPartida = {
                        periodo_contableId: idPeriodoContable,
                        numero_partida,
                        usuario_crea,
                        observaciones
                    };
                    let nuevaPartida = await PartidaContable.create(infoPartida, { transaction });
                    if (nuevaPartida) {
                        let { partida_contableId } = nuevaPartida;

                        for await (let { cuenta_contableId, contraparte, monto } of detalle) {
                            let idTipo_contraparte = undefined;
                            let idContraparte = undefined;
                            let totalContraparte = 0;

                            if (contraparte) {
                                let { tipo_contraparteId, contraparteId = 0, detalle: detalleContraparte } = contraparte;
                                idTipo_contraparte = tipo_contraparteId;

                                if (Number(contraparteId) > 0) {
                                    idContraparte = contraparteId;
                                }
                                else {
                                    let itemTipoContraparte = await TipoContraParte.findOne({
                                        where: { tipo_contraparteId, estadoId: [1] },
                                        attributes: ['tipo_contraparteId'],
                                    }, { transaction });

                                    if (!itemTipoContraparte) {
                                        response.code = -1;
                                        response.data = "El tipo de contraparte enviado no existe por favor verifique";
                                        return response;
                                    } else {
                                        let infoControlComprobante = {
                                            usuario_crea,
                                            estadoId: 1
                                        }
                                        let insertComprobante = await ControlComprobante.create(infoControlComprobante, { transaction });
                                        if (insertComprobante) {
                                            let { control_comprobanteId } = insertComprobante;
                                            idContraparte = control_comprobanteId;
                                            for await (let itemDetalle of detalleContraparte) {
                                                let { tipo_comprobanteId } = itemDetalle;
                                                let itemTipoComprobante = await TipoComprobante.findOne({
                                                    where: { tipo_comprobanteId, estadoId: [1] },
                                                    attributes: ['tipo_comprobanteId'],
                                                }, { transaction });
                                                if (!itemTipoComprobante) {
                                                    response.code = -1;
                                                    response.data = "El tipo de comprobante enviado, en detalle de la contraparte no existe por favor verifique";
                                                    return response;
                                                } else {

                                                    itemDetalle.control_comprobanteId = control_comprobanteId;
                                                    itemDetalle.usuario_crea = usuario_crea;
                                                    await ControlComprobanteDetalle.create(itemDetalle, { transaction });
                                                    totalContraparte += itemDetalle.monto;
                                                }
                                            }
                                        } else {
                                            response.code = -1;
                                            response.data = "Ocurrió un error al registrar el comprobante, por favor intente nuevamente";
                                            return response;
                                        }
                                    }
                                    if (monto < 0 && monto !== 0) {
                                        if ((Number(monto) + Number(totalContraparte)) !== 0) {
                                            response.code = -1;
                                            response.data = "El monto total de detalle de la contraparte no es igual al monto de la transacción";
                                            return response;
                                        }
                                    } else {
                                        if (monto != totalContraparte) {
                                            response.code = -1;
                                            response.data = "El monto total de detalle de la contraparte no es igual al monto de la transacción";
                                            return response;
                                        }
                                    }

                                }
                            }
                            let itemDetalle = {
                                partida_contableId,
                                cuenta_contableId,
                                tipo_contraparteId: idTipo_contraparte,
                                contraparteId: idContraparte,
                                monto,
                                usuario_crea
                            };
                            cuadrePartida += monto;
                            await PartidaContableDetalle.create(itemDetalle, { transaction })
                        }

                        if (cuadrePartida === 0) {
                            response.code = 1;
                            response.data = "Partida registrada exitosamente";
                            return response;
                        } else {
                            response.code = -1;
                            response.data = "La suma del debe y del haber no cuadra, por favor verifique";
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
        response.data = error;
        return response;
    }
}

module.exports = {
    Registrar
}