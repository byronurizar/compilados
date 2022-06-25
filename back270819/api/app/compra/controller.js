const moment = require('moment');
var sequelize = require('sequelize');
var { Op } = require('sequelize');
const { Compra, CompraDetalle, Stock, LoteProducto, ModuloSistemaConfiguracionDetalle, Producto, Estado, EmpresaRegimenFiscal, PorcentajeInpuestoRegimenFiscal, Usuario, Sucursal, Proveedor, TipoPago, TipoDTE, MediaDetalle, ProductoTipoPresentacion } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const PartidaDiario = require('../../../utils/funciones/PartidaDiario');
const { RegistrarMedia } = require('../../../utils/funciones/RegistrarMedia');
const MenuId = 46;


const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let transaction;
    try {
        transaction = await Compra.sequelize.transaction();
        let result = await RegistraCompra(req, transaction);
        if (result.code === 1) {
            await transaction.commit();
        } else {
            await transaction.rollback();
        }
        response = result;
        return result;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
}

const RegistraCompra = async (req, transaction) => {
    let response = {};
    let files = req.files || [];
    try {
        let { datos } = req.body;
        datos = JSON.parse(datos);
        let infoCompraInsert;
        const { proveedorId,
            monto_excento_iva = 0,
            tipo_dteId = 0,
            recargo_descuento = 0,
            sucursalId,
            tipo_pagoId,
            cuenta_bancariaId = 0,
            observaciones,
            detalle } = datos;
        let informacion_pagoId = undefined;
        let { usuarioId, empresaId } = req.user;

        if (!detalle) {
            response.code = -1;
            response.data = "No se agrego un detalle de la compra";
            return response;
        }

        if (detalle.length <= 0) {
            response.code = -1;
            response.data = "No existe detalle de la compra, por favor verifique";
            return response;
        }

        if (!proveedorId) {
            response.code = -1;
            response.data = "No es posible registrar la compra ya que no se agregó información del proveedor";
            return response;
        }

        if (!sucursalId) {
            response.code = -1;
            response.data = "No es posible registrar la compra ya que no se agregó información de la sucursal";
            return response;
        }

        if (Number(tipo_dteId) <= 0) {
            response.code = -1;
            response.data = "Favor enviar un tipo de DTE válido";
            return response;
        }

        let dataPartida = [];
        let totalCompra = detalle.reduce((prev, cur) => Number(prev) + (Number(cur.cantidad) * Number(cur.precio_compra)), 0);
        let parametrosModulo = await ModuloSistemaConfiguracionDetalle.findAll({
            where: sequelize.literal(`estadoId=1 and modulo_configuracionId in (select modulo_configuracionId from modulo_configuracion where moduloId=3 and estadoId=1 and empresaId=${empresaId})`),
            attributes: ['serialId', 'config_parametroId', 'valor'],
            transaction
        });

        let regimenFiscalEmprsa = await EmpresaRegimenFiscal.findOne({
            where: { empresaId, estadoId: 1 },
            attributes: ['serialId', 'regimen_fiscalId'],
            transaction
        });

        if (!regimenFiscalEmprsa) {
            response.code = -1;
            response.data = "La empresa no cuenta con un regimen fiscal asignado, por favor comuniquese con el administrador";
            return response;
        }

        let cuentaCompras = parametrosModulo.find(i => Number(i.config_parametroId) === 1);
        if (!cuentaCompras) {
            response.code = -1;
            response.data = "No se ha configurado cuenta contable para el registro de MERCADERIA";
            return response;
        }
        let { valor: cuentaIdCompras } = cuentaCompras;
        if (Number(cuentaIdCompras) <= 0) {
            response.code = -1;
            response.data = "La cuenta contable de registro de  MERCADERIA no es valida";
            return response;
        }

        let { regimen_fiscalId } = regimenFiscalEmprsa;
        if (regimen_fiscalId > 0 && regimen_fiscalId !== 1 && tipo_dteId === 1) {
            let porcentajeImpuestoRegimen = await PorcentajeInpuestoRegimenFiscal.findOne({
                where: { regimen_fiscalId, tipo_impuestoId: 1, estadoId: 1 },
                attributes: ['serialId', 'porcentaje'],
                transaction
            });

            if (!porcentajeImpuestoRegimen) {
                response.code = -1;
                response.data = "El regimen fiscal asignado a la empresa no cuenta con porcentaje que se debe de aplicar, por favor comuniquese con el administrador";
                return response;
            }
            let { porcentaje: porcentajeIva = 0 } = porcentajeImpuestoRegimen;
            if (porcentajeIva <= 0) {
                response.code = -1;
                response.data = "El porcentaje de IVA POR COBRAR debe ser mayor a 0";
                return response;
            }

            let montoSinIva = Number(Number(totalCompra) / (1 + Number(porcentajeIva))).toFixed(2);
            let montoIvaPorCobrar = Number(Number(totalCompra) - montoSinIva).toFixed(2);

            let cuentaIvaPorCobrar = parametrosModulo.find(i => Number(i.config_parametroId) === 5);

            if (!cuentaIvaPorCobrar) {
                response.code = -1;
                response.data = "No se ha configurado cuenta contable para el registro de IVA POR COBRAR";
                return response;
            }

            let { valor: cuentaIdIvaPorCobrar } = cuentaIvaPorCobrar;

            if (Number(cuentaIdIvaPorCobrar) <= 0) {
                response.code = -1;
                response.data = "La cuenta contable de registro de  IVA POR COBRAR no es valida";
                return response;
            }

            dataPartida.push({
                cuenta_contableId: Number(cuentaIdCompras),
                monto: Number.parseFloat(montoSinIva)
            });

            dataPartida.push({
                cuenta_contableId: Number(cuentaIdIvaPorCobrar),
                monto: Number.parseFloat(montoIvaPorCobrar)
            });

        } else {
            dataPartida.push({
                cuenta_contableId: Number(cuentaIdCompras),
                monto: Number.parseFloat(totalCompra)
            });
        }

        if (tipo_pagoId <= 0) {
            response.code = -1;
            response.data = "Se debe de enviar un tipo de pago válido";
            return response;
        }

        if (Number(tipo_pagoId) === 1) {
            let cuentaCaja = parametrosModulo.find(i => Number(i.config_parametroId) === 2);
            if (!cuentaCaja) {
                response.code = -1;
                response.data = "No se ha configurado cuenta contable para el registro de CAJA";
                return response;
            }
            let { valor: cuentaIdCaja } = cuentaCaja;
            if (Number(cuentaIdCaja) <= 0) {
                response.code = -1;
                response.data = "La cuenta contable de registro de  CAJA no es valida";
                return response;
            }
            dataPartida.push({
                cuenta_contableId: Number(cuentaIdCaja),
                monto: Number.parseFloat(-totalCompra)
            });
        }

        if (Number(tipo_pagoId) === 2) {
            let cuentaBancos = parametrosModulo.find(i => Number(i.config_parametroId) === 3);
            if (!cuentaBancos) {
                response.code = -1;
                response.data = "No se ha configurado cuenta contable para el registro de BANCOS";
                return response;
            }
            let { valor: cuentaIdBanco } = cuentaBancos;
            if (Number(cuentaIdBanco) <= 0) {
                response.code = -1;
                response.data = "La cuenta contable de registro de  BANCOS no es valida";
                return response;
            }
            if (Number(cuenta_bancariaId) <= 0) {
                response.code = -1;
                response.data = "Al realizar un pago utilizando la cuenta contable BANCOS debe de seleccionar una cuenta bancaria";
                return response;
            }
            let auxCuenta = {};
            auxCuenta.cuenta_contableId = Number(cuentaIdBanco);
            auxCuenta.monto = Number.parseFloat(-totalCompra);
            let contraparte = {};
            let detalleContraparte = [{
                llaveId: Number(cuenta_bancariaId),
                monto: Number.parseFloat(-totalCompra)
            }];
            contraparte.detalle = detalleContraparte;
            auxCuenta.contraparte = contraparte;
            dataPartida.push(auxCuenta);
        }

        if (Number(tipo_pagoId) === 3) {
            let cuentaProveedores = parametrosModulo.find(i => Number(i.config_parametroId) === 4);
            if (!cuentaProveedores) {
                response.code = -1;
                response.data = "No se ha configurado cuenta contable para el registro de PROVEEDORES";
                return response;
            }
            let { valor: cuentaIdProveedores } = cuentaProveedores;
            if (Number(cuentaIdProveedores) <= 0) {
                response.code = -1;
                response.data = "La cuenta contable de registro de  PROVEEDORES no es valida";
                return response;
            }

            let auxCuenta = {};
            auxCuenta.cuenta_contableId = Number(cuentaIdProveedores);
            auxCuenta.monto = Number.parseFloat(-totalCompra);
            let contraparte = {};
            let detalleContraparte = [{
                llaveId: Number(proveedorId),
                monto: Number.parseFloat(-totalCompra)
            }];
            contraparte.detalle = detalleContraparte;
            auxCuenta.contraparte = contraparte;
            dataPartida.push(auxCuenta);
        }

        if (Number(tipo_pagoId) > 3) {
            response.code = -1;
            response.data = "Forma de pago enviada no válida, por favor verifique";
            return response;
        }

        if (dataPartida.length <= 0) {
            response.code = -1;
            response.data = "No es posible registrar la compra ya que no se logro armar la información contable";
            return response;
        }

        let mediaId = undefined;
        if (files.length > 0) {
            let infoMedia = await RegistrarMedia(files, transaction, usuarioId);
            if (infoMedia.code <= 0) {
                return infoMedia;
            } else {
                mediaId = infoMedia.code;
            }
        }

        let infoCompra = {
            proveedorId,
            sucursalId,
            tipo_pagoId,
            tipo_dteId,
            monto_excento_iva: 0,
            recargo_descuento,
            observaciones,
            informacion_pagoId,
            usuario_crea: usuarioId,
            mediaId
        }
        infoCompraInsert = await Compra.create(infoCompra, { transaction });
        const { compraId = undefined } = infoCompraInsert
        if (!compraId) {
            response.code = -1;
            response.data = "No se logró registrar la compra, por favor intente nuevamente";
            return response;
        }
        let alertasDetalle = [];
        let existeAlerta = false;
        for await (let { productoId, cantidad, lote = undefined, fecha_vencimiento = undefined, precio_compra, tipo_presentacionId = 0 } of detalle) {
            if (Number(tipo_presentacionId) <= 0) {
                alertasDetalle.push({
                    productoId,
                    producto: nombre,
                    codigo,
                    alerta: 'El tipo de presentación enviado no es valido'
                });
                existeAlerta = true;

            }
            let itemProducto = await Producto.findOne({
                where: { productoId },
                attributes: ['codigo', 'nombre', 'perecedero', 'estadoId'],
                transaction
            });

            if (itemProducto) {
                let itemProductoTipoPresentacion = await ProductoTipoPresentacion.findOne({
                    where: { productoId, tipo_presentacionId, estadoId: 1 },
                    attributes: ['tipo_presentacionId'],
                    transaction
                });

                if (itemProductoTipoPresentacion) {
                    let { codigo, nombre, perecedero, estadoId } = itemProducto;

                    if (estadoId !== 1) {
                        alertasDetalle.push({
                            productoId,
                            producto: nombre,
                            codigo,
                            alerta: 'El producto no esta activo, por favor verifique'
                        });
                        existeAlerta = true;
                    } else {
                        let itemStock = await Stock.findOne({
                            where: { productoId, sucursalId, estadoId: 1 },
                            attributes: ['stockId', 'disponible'],
                            transaction
                        });

                        if (!itemStock) {
                            alertasDetalle.push({
                                productoId,
                                producto: nombre,
                                codigo,
                                alerta: 'El producto no cuenta con un stock asignado, por favor verifique'
                            });
                            existeAlerta = true;
                        } else {
                            if (String(fecha_vencimiento).trim().length <= 0) {
                                if (perecedero === true) {
                                    alertasDetalle.push({
                                        productoId,
                                        producto: nombre,
                                        codigo,
                                        alerta: 'El producto es consumible y no cuenta con fecha de vencimiento, por favor verifique'
                                    });
                                    existeAlerta = true;
                                } else {
                                    fecha_vencimiento = undefined;
                                }
                            }
                            if (String(lote).trim().length <= 0) {
                                if (perecedero === true) {
                                    alertasDetalle.push({
                                        productoId,
                                        producto: nombre,
                                        codigo,
                                        alerta: 'El producto es perecedero y no cuenta con número de lote, por favor verifique'
                                    });
                                    existeAlerta = true;
                                } else {
                                    lote = undefined;
                                }
                            }

                            let { stockId, disponible } = itemStock;

                            let infoDetalleCompra = {
                                compraId,
                                productoId,
                                cantidad,
                                tipo_presentacionId: Number(tipo_presentacionId),
                                lote: lote && String(lote).trim(),
                                fecha_vencimiento,
                                precio_compra: Number.parseFloat(precio_compra),
                                usuario_crea: usuarioId
                            }

                            await CompraDetalle.create(infoDetalleCompra, { transaction });

                            let tipoPresentacionProducto = await ProductoTipoPresentacion.findOne({
                                where: { productoId, tipo_presentacionId, estadoId: 1 },
                                attributes: ['unidades'],
                                transaction
                            });

                            let { unidades } = tipoPresentacionProducto;
                            let dataStock = {
                                disponible
                            };
                            disponible = Number(disponible) + (Number(cantidad) * Number(unidades));

                            let infoStock = {
                                disponible
                            }
                            const resultado = await Stock.update(infoStock, {
                                where: {
                                    stockId
                                },
                                transaction
                            });

                            if (resultado > 0) {
                                infoStock.usuario_ult_mod = usuarioId;
                                await registrarBitacora(req, "stock", stockId, dataStock, infoStock);
                                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                                const dataUpdFecha = {
                                    fecha_ult_mod,
                                    usuario_ult_mod: usuarioId
                                }
                                await Stock.update(dataUpdFecha, {
                                    where: {
                                        stockId
                                    },
                                    transaction
                                });
                                if (perecedero === true) {
                                    let itemLoteProducto = await LoteProducto.findOne({
                                        where: { productoId, sucursalId, descripcion: lote.trim() },
                                        attributes: ['lote_productoId', 'disponible', 'cantidad_inicial', 'fecha_vencimiento'],
                                        transaction
                                    });

                                    if (itemLoteProducto) {
                                        let { lote_productoId, cantidad_inicial, disponible: disponibleLoteProdu, fecha_vencimientoLoteProdu } = itemLoteProducto;
                                        let infoLoteProduAnterior = {
                                            disponible: disponibleLoteProdu
                                        };
                                        disponibleLoteProdu = Number(disponibleLoteProdu) + Number(cantidad);
                                        let cantidadInicial = Number(cantidad_inicial) + Number(cantidad);
                                        let infoLoteProdu = {
                                            disponible: disponibleLoteProdu,
                                            cantidad_inicial: cantidadInicial
                                        };

                                        const resultadoLoteProdu = await LoteProducto.update(infoLoteProdu, {
                                            where: {
                                                lote_productoId
                                            }
                                            , transaction
                                        });
                                        
                                        if (resultadoLoteProdu > 0) {
                                            infoLoteProdu.usuario_ult_mod = usuarioId;
                                            await registrarBitacora(req, "lote_producto", lote_productoId, infoLoteProduAnterior, infoLoteProdu);

                                            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                                            const dataUpdFechaLoteProdu = {
                                                fecha_ult_mod,
                                                usuario_ult_mod: usuarioId
                                            }
                                            await LoteProducto.update(dataUpdFechaLoteProdu, {
                                                where: {
                                                    lote_productoId
                                                },
                                                transaction
                                            });

                                        } else {
                                            alertasDetalle.push({
                                                productoId,
                                                producto: nombre,
                                                codigo,
                                                alerta: 'No se logró registrar en la tabla de lotes de productos, por favor comuniquese con Soporte'
                                            });
                                            existeAlerta = true;
                                        }

                                    } else {
                                        let diasMinimoVencimientoProducto = parametrosModulo.find(i => Number(i.config_parametroId) === 8);
                                        if (!diasMinimoVencimientoProducto) {
                                            response.code = -1;
                                            response.data = `El producto ${nombre} es perecedero y no se ha configurado el máximo de días que se acepta un producto antes de vencer`;
                                            return response;
                                        }

                                        let { valor: diasMaximo } = diasMinimoVencimientoProducto;

                                        let diasParaVencer = moment.duration(moment(fecha_vencimiento, 'YYYY-MM-DD').diff(moment(new Date()))).asDays();
                                        if (diasParaVencer <= diasMaximo) {
                                            alertasDetalle.push({
                                                productoId,
                                                producto: nombre,
                                                codigo,
                                                alerta: 'La fecha de vencimiento del producto no es válida'
                                            });
                                            existeAlerta = true;
                                        } else {
                                            let infoLoteProducto = {
                                                productoId,
                                                sucursalId,
                                                descripcion: lote && String(lote).trim(),
                                                fecha_vencimiento,
                                                cantidad_inicial: cantidad,
                                                disponible: cantidad,
                                                usuario_crea: usuarioId
                                            }
                                            await LoteProducto.create(infoLoteProducto, { transaction });
                                        }
                                    }
                                }

                            } else {
                                alertasDetalle.push({
                                    productoId,
                                    producto: nombre,
                                    codigo,
                                    alerta: 'No se logro actualizar el stock, por favor verifique'
                                });
                                existeAlerta = true;
                            }

                        }
                    }
                } else {
                    alertasDetalle.push({
                        productoId,
                        producto: nombre,
                        codigo: "N/A",
                        alerta: 'El tipo de presentación del producto no es valido'
                    });
                    existeAlerta = true;
                }
            } else {
                alertasDetalle.push({
                    productoId,
                    producto: "PRODUCTO NO REGISTRADO",
                    codigo: "N/A",
                    alerta: 'No se logro actualizar el stock, por favor verifique'
                });
                existeAlerta = true;
            }
        }

        if (!existeAlerta) {
            let result = await PartidaDiario.Registrar(transaction, { detalle: dataPartida, observaciones }, usuarioId, empresaId);

            if (result.code === 1) {
                response.code = 1;
                response.data = infoCompraInsert;
                return response;
            } else {
                return result;
            }

        } else {
            response.code = 0;
            let data = {
                mensaje: "No se logró realizar el registro de la compra por las siguientes razones",
                alerta: alertasDetalle
            }
            response.data = data;
            return response;
        }
    } catch (error) {
        response.code = -1;
        response.data = "Ocurrió un error al registrar la información de la compra, por favor comuniquese con soporte";
        if (error) {
            throw new Error(error);
        }
        return response;
    }
}



const filtrarCompras = async (req) => {
    let response = {};
    let alerta = "";
    let whereAux = '';
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let { fechaInicial = undefined, fechaFinal = undefined, sucursalId = undefined, proveedorId = undefined, tipo_pagoId = undefined, tipo_dteId = undefined } = req.body;
    if (!fechaInicial || !fechaFinal) {
        alerta = "Favor de enviar fecha inicial y fecha final";
    }
    if (alerta) {
        response.code = 0;
        response.data = alerta;
        return response;
    }
    fechaFinal = moment(fechaFinal, 'YYYY-MM-DD').add(1, "days").format('YYYY-MM-DD');
    whereAux = `compra.fecha_crea between '${fechaInicial}' and '${fechaFinal}'`;

    if (proveedorId) {
        whereAux += ` and compra.proveedorId=${proveedorId}`
    }

    if (sucursalId) {
        whereAux += ` and compra.sucursalId=${sucursalId}`
    }

    if (tipo_pagoId) {
        whereAux += ` and compra.tipo_pagoId=${tipo_pagoId}`
    }

    if (tipo_dteId) {
        whereAux += ` and compra.tipo_dteId=${tipo_dteId}`
    }

    let data = await Compra.findAll({
        include: [
            {
                model: Usuario,
                as: "Usuario",
                require: true,
                attributes: ['user_name']
            }, {
                model: Sucursal,
                as: "Sucursal",
                require: true,
                attributes: ['nombre']
            },
            {
                model: Proveedor,
                as: "Proveedor",
                require: true,
                attributes: ['nombre']
            },
            {
                model: TipoPago,
                as: "TipoPago",
                require: true,
                attributes: ['nombre']
            },
            {
                model: TipoDTE,
                as: "TipoDTE",
                require: true,
                attributes: ['codigo', 'descripcion']
            },
            {
                model: CompraDetalle,
                as: "Detalle",
                require: true,
                attributes: ['precio_compra', 'cantidad'],
                where: { precio_compra: { [Op.gt]: 0 } }
            }
        ],
        attributes: {
            exclude: ["monto_excento_iva", "recargo_descuento", "usuario_ult_mod", "fecha_ult_mod", "estadoId", "sucursalId", "proveedorId", "tipo_pagoId", "tipo_dteId"],
        },
        where: sequelize.literal(whereAux)
    });

    response.code = 1;
    response.data = data;
    return response;
}

const listarCompra = async (req) => {
    let response = {};
    let { id } = req.params;
    if (Number(id) > 0) {
        response.code = 1;
        response.data = await CompraDetalle.findAll({
            where: { compraId: id, estadoId: 1 },
            include: [
                {
                    model: Producto,
                    as: "Producto",
                    required: true,
                    attributes: ['codigo', 'nombre'],
                }
            ],
            attributes: ['compra_detalleId', 'cantidad', 'precio_compra', 'lote', 'fecha_vencimiento'],
        });
        return response;
    } else {
        response.code = -1;
        response.data = "El número de la compra no es válido";
        return response;
    }
}

const listarMediaCompra = async (req) => {
    let response = {};
    let { id } = req.params;
    if (Number(id) > 0) {
        response.code = 1;
        response.data = await MediaDetalle.findAll({
            where: { mediaId: id, estadoId: 1 },
            attributes: ['media_detalleId', 'mediaId', 'nombre', 'mimetype', 'blob'],
        });
        return response;
    } else {
        response.code = -1;
        response.data = "El número de la compra no es válido";
        return response;
    }
}




module.exports = {
    list: filtrarCompras,
    insert,
    listarCompra,
    listarMediaCompra
}