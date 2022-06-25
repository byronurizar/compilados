const { QueryTypes } = require('sequelize');
var sequelize = require('sequelize');
const moment = require('moment');
var { Op } = require('sequelize');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const PartidaDiario = require('../../../utils/funciones/PartidaDiario');
const QRCode = require('qrcode');
const {
    Factura,
    Sucursal,
    UsuarioSucursal,
    TipoPago,
    Producto,
    ProductoTipoPresentacion,
    Stock,
    ModuloSistemaConfiguracionDetalle,
    EmpresaRegimenFiscal,
    FacturaDetalle,
    LoteProducto,
    PorcentajeInpuestoRegimenFiscal,
    Empresa,
    Certificador,
    bd,
    TipoDTE } = require('../../../store/db');
const { Certificar, GenerarToken, GetDatosCertificador, CertificarDTE, GetDatosEmpresa, GetDatosCliente } = require('../../../utils/funciones/FacturaElectronica');
const { ModeloFactV1 } = require('../../../utils/PlantillasFactura/FactV1');
const config = require('../../../config');
const MenuId = 49;
const Modelo = Factura;
const tabla = 'factura';

const validarInfo = async (req) => {
    let response = {};
    let datosEmpresa = {};
    let datosCertificador = {};
    let datosCliente = {};
    let datosUsuario = {};
    let detalleFactura = [];
    let {
        sucursalId = 0,
        personaId = 0,
        tipo_pagoId = 0,
        cajaId = 0,
        observaciones = "",
        detalle = []
    } = req.body;
    let { usuarioId, empresaId } = req.user;

    let regimenFiscalEmprsa = await EmpresaRegimenFiscal.findOne({
        where: { empresaId, estadoId: 1 },
        attributes: ['serialId', 'regimen_fiscalId', 'tipo_dteId']
    });

    let parametrosModulo = await ModuloSistemaConfiguracionDetalle.findAll({
        where: sequelize.literal(`estadoId=1 and modulo_configuracionId in (select modulo_configuracionId from modulo_configuracion where moduloId in(3,4) and estadoId=1 and empresaId=${empresaId})`),
        attributes: ['serialId', 'config_parametroId', 'valor']
    });

    if (!regimenFiscalEmprsa) {
        response.code = -1;
        response.data = "La empresa no cuenta con un regimen fiscal asignado, por favor comuniquese con el administrador";
        return response;
    }

    let { regimen_fiscalId, tipo_dteId } = regimenFiscalEmprsa;
    if (!regimen_fiscalId) {
        response.code = -1;
        response.data = "La empresa no tiene asignado un regimen fiscal, por favor verifique";
        return response;
    }

    let porcentajeImpuestoRegimen = await PorcentajeInpuestoRegimenFiscal.findOne({
        where: { regimen_fiscalId, tipo_impuestoId: 1, estadoId: 1 },
        attributes: ['serialId', 'porcentaje']
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

    let cuentaIdIvaPorPagar = parametrosModulo.find(i => Number(i.config_parametroId) === 6);
    if (!cuentaIdIvaPorPagar) {
        response.code = -1;
        response.data = "No se logró obtener la información de la cuenta de registro de iva por pagar";
        return response;
    }
    datosEmpresa.cuentaIdIvaPorPagar = cuentaIdIvaPorPagar.valor;

    datosEmpresa.porcentajeIva = porcentajeIva;
    let cuentaIdVentas = parametrosModulo.find(i => Number(i.config_parametroId) === 9);
    if (!cuentaIdVentas) {
        response.code = -1;
        response.data = "No se logró obtener la información de la cuenta de registro de ventas";
        return response;
    }

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

    response = await GetDatosEmpresa(empresaId);
    if (response.code !== 1) {
        return response;
    }
    let itemCatTipoDTE = await TipoDTE.findOne({
        where: { tipo_dteId, estadoId: 1 },
        attributes: ['tipo_dteId', 'codigo']
    });
    if (!itemCatTipoDTE) {
        response.code = -1;
        response.data = "El tipo de DTE que tiene asignado la empresa no es válido";
        return response;
    }
    let { codigo } = itemCatTipoDTE;
    datosEmpresa = { ...datosEmpresa, ...response.data }
    datosEmpresa.tipoDTE = codigo;
    datosEmpresa.cuentaIdVentas = cuentaIdVentas.valor;
    datosEmpresa.regimen_fiscalId = regimen_fiscalId;
    datosEmpresa.tipo_dteId = tipo_dteId;
    datosEmpresa.cuentaIdCaja = cuentaIdCaja;
    response = await GetDatosCertificador(datosEmpresa);
    if (response.code !== 1) {
        return response;
    }
    datosCertificador = response.data;

    response = await GetDatosCliente(personaId);
    if (response.code !== 1) {
        return response;
    }
    datosCliente = response.data;
    if (detalle.length <= 0) {
        response.code = -1;
        response.data = "No se ha agregado ningún detalle en la factura";
        return response;
    }

    if (sucursalId <= 0) {
        response.code = -1;
        response.data = "No se envió el código de la suucural";
        return response;
    }
    let sucursalActiva = await Sucursal.findOne({
        where: { sucursalId, estadoId: 1 }
    });

    if (!sucursalActiva) {
        response.code = -1;
        response.data = "La sucursal no esta activada";
        return response;
    }
    let usuarioSucursal = await UsuarioSucursal.findOne({
        where: { sucursalId, usuarioId, estadoId: 1 }
    });

    if (!usuarioSucursal) {
        response.code = -1;
        response.data = "La sucursal no esta asignada al usuario";
        return response;
    }
    datosUsuario.usuarioId = usuarioId;
    datosUsuario.empresaId = empresaId;
    datosUsuario.sucursalId = sucursalId;

    if (personaId < -1 || personaId === 0) {
        response.code = -1;
        response.data = "La información del cliente no es valida";
        return response;
    }
    if (tipo_pagoId <= 0) {
        response.code = -1;
        response.data = "El tipo de pago no es válido";
        return response;
    }
    let exiteTipoPago = await TipoPago.findOne({
        where: { tipo_pagoId, estadoId: 1 }
    });
    if (!exiteTipoPago) {
        response.code = -1;
        response.data = "El tipo de pago enviado no esta disponible";
        return response;
    }
    if (cajaId <= 0) {
        response.code = -1;
        response.data = "La información de la caja no es valida";
        return response;
    }

    let listaErrores = [];
    for await (let { productoId, bien_servicio = 'B', unidad_medida = 'UNI', tipo_presentacionId, cantidad = 0, precio_unitario = 0, descuento = 0 } of detalle) {
        let itemFactura = {};
        let itemProducto = await Producto.findOne({
            where: { productoId, estadoId: 1 }
        });

        if (!itemProducto) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: "El producto no existe"
            });
            continue;
        }
        let { codigo, nombre } = itemProducto;
        let itemTipoPresentacion = await ProductoTipoPresentacion.findOne({
            where: { productoId, tipo_presentacionId, estadoId: 1 }
        });

        if (precio_unitario <= 0) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El precio del producto ${nombre} con código ${codigo} no es válido`
            });
            continue;
        }
        if (cantidad <= 0) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `La cantidad del producto ${nombre} con código ${codigo} no es válido`
            });
            continue;
        }
        if (descuento < 0) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El descuento del producto ${nombre} con código ${codigo} no es válido`
            });
            continue;
        }
        if (!itemTipoPresentacion) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no existe en el tipo de presentación enviado`
            });
            continue;
        }
        let { unidades = 0, precio_venta = 0 } = itemTipoPresentacion;
        if (unidades <= 0) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con información valida en la asignaciones de tipo de presentación`
            });
            continue;
        }
        if (Number(precio_venta) <= 0) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con información valida en el precio de venta`
            });
            continue;
        }
        let itemStockTipoPresentacion = await Stock.findOne({
            where: { productoId, sucursalId, estadoId: 1 }
        });
        if (!itemStockTipoPresentacion) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con asignación de stock`
            });
            continue;
        }
        let { disponible = 0 } = itemStockTipoPresentacion;
        let totalSalida = Number(unidades) * Number(cantidad);
        if (disponible < totalSalida) {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con stock disponible para el tipo de presentación enviado, unicamente existen ${disponible} unidades`
            });
            continue;
        }

        let existeItem = detalleFactura.find(i => Number(i.productoId) === Number(productoId) && Number(i.tipo_presentacionId) === Number(tipo_presentacionId));
        let multiplicadorIva = 1 + Number(Number(datosEmpresa.porcentajeIva).toFixed(2));
        if (!existeItem) {
            itemFactura.bienOServicio = bien_servicio;
            itemFactura.nombre = nombre;
            itemFactura.unidadMedida = unidad_medida;
            itemFactura.productoId = productoId;
            itemFactura.tipo_presentacionId = tipo_presentacionId;
            itemFactura.cantidad = Number(Number(cantidad).toFixed(2));
            itemFactura.descuento = Number(Number(descuento).toFixed(2));
            itemFactura.precio_unitario = Number(Number(precio_unitario).toFixed(2));
            let precioFilaSinDescuento = Number(itemFactura.precio_unitario) * Number(itemFactura.cantidad);
            let precioFilaConDescuento = Number(precioFilaSinDescuento) - Number(itemFactura.descuento);
            let totalFilaSinIva = Number(Number(Number(precioFilaConDescuento) / Number(multiplicadorIva)).toFixed(2));
            let totalIva = Number(Number(Number(totalFilaSinIva) * Number(multiplicadorIva)).toFixed(2)) - Number((Number(totalFilaSinIva).toFixed(2)));
            itemFactura.precioFila = precioFilaSinDescuento;
            itemFactura.totalFilaSinIva = totalFilaSinIva;
            itemFactura.totalIva = Number(Number(totalIva).toFixed(2));
            detalleFactura.push(itemFactura);
        } else {
            let nuevoDetalle = detalleFactura.map(filaDetalleFactura => {
                if (Number(filaDetalleFactura.productoId) === Number(productoId) && Number(filaDetalleFactura.tipo_presentacionId) === Number(tipo_presentacionId)) {
                    filaDetalleFactura.cantidad += Number(Number(cantidad).toFixed(2));
                    let precioFilaSinDescuento = Number(filaDetalleFactura.precio_unitario) * Number(filaDetalleFactura.cantidad);
                    let precioFilaConDescuento = Number(precioFilaSinDescuento) - Number(filaDetalleFactura.descuento);
                    let totalFilaSinIva = Number(Number(Number(precioFilaConDescuento) / Number(multiplicadorIva)).toFixed(2));
                    let totalIva = Number(Number(Number(totalFilaSinIva) * Number(multiplicadorIva)).toFixed(2)) - Number((Number(totalFilaSinIva).toFixed(2)));
                    filaDetalleFactura.precioFila = precioFilaSinDescuento;
                    filaDetalleFactura.totalFilaSinIva = totalFilaSinIva;
                    filaDetalleFactura.totalIva = Number(Number(totalIva).toFixed(2));
                }
                return filaDetalleFactura;

            });
            detalleFactura = nuevoDetalle;
        }
    }
    if (listaErrores.length > 0) {
        response.code = -3;
        response.data = listaErrores;
        return response;
    } else {
        response.code = 1;
        response.data = {
            datosEmpresa,
            datosCertificador,
            datosCliente,
            detalleFactura,
            datosUsuario
        };
        return response;
    }
}
const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let response = {};
    let { usuarioId, empresaId } = req.user;
    let datosValidacion = {};
    req.body.tipo_pagoId = 1;
    let validacion = await validarInfo(req);
    if (validacion.code !== 1) {
        return validacion;
    }
    datosValidacion = validacion.data;
    let {
        tipo_pagoId,
        numero_autorizacion = '',
        serie = '',
        numeroDTE = '',
        cajaId,
        observaciones
    } = req.body;

    let { datosEmpresa = 0, datosCliente, datosUsuario, detalleFactura = [] } = datosValidacion;
    let { tipo_dteId } = datosEmpresa;
    let { sucursalId } = datosUsuario;
    let { personaId } = datosCliente;
    let datosFactura = {};
    datosFactura.detalle = detalleFactura;
    let transaction;
    try {
        transaction = await Factura.sequelize.transaction();
        let infoFactura = {
            empresaId,
            sucursalId,
            personaId,
            tipo_pagoId,
            tipo_dteId,
            numero_autorizacion: '',
            serie: '',
            numeroDTE: '',
            cajaId,
            observaciones,
            usuario_crea: usuarioId
        };
        let regFactura = await Factura.create(infoFactura, { transaction });
        if (regFactura) {
            let { facturaId, fecha_crea } = regFactura;
            let data = {};
            datosFactura.facturaId = facturaId;
            datosFactura.fechaFactura = fecha_crea;
            datosValidacion.datosFactura = datosFactura;
            delete datosValidacion.detalleFactura;
            response = await InsertDetalle(req, datosValidacion, transaction);
            if (response.code === 1) {
                await transaction.commit();
                response.code = 1;
                response.data = facturaId;
                return response;
            } else {
                await transaction.rollback();
                return response;
            }
        } else {
            response.code = -1;
            response.data = "Ocurrió un error al momento de intentar generar la factura";
            await transaction.rollback();
            return response;
        }

    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }

}
const InsertDetalle = async (req, datosValidacion, transaction) => {
    let listaErrores = [];
    let response = {};
    let { datosUsuario, datosFactura } = datosValidacion;
    let { sucursalId, usuarioId } = datosUsuario;
    let { facturaId, detalle } = datosFactura;
    for await (let { productoId, precio_unitario = 0, totalIva, totalFilaSinIva, tipo_presentacionId, cantidad = 0, descuento = 0 } of detalle) {
        let itemProducto = await Producto.findOne({
            where: { productoId, estadoId: 1 },
            attributes: ['productoId', 'codigo', 'nombre', 'perecedero'],
            transaction
        });

        let { codigo, nombre, perecedero = false } = itemProducto;
        let itemTipoPresentacion = await ProductoTipoPresentacion.findOne({
            where: { productoId, tipo_presentacionId, estadoId: 1 },
            attributes: ['productoId', 'tipo_presentacionId', 'unidades', 'precio_venta'],
            transaction
        });

        let { unidades = 0 } = itemTipoPresentacion;

        let itemStock = await Stock.findOne({
            where: { productoId, sucursalId, estadoId: 1 },
            attributes: ['stockId', 'productoId', 'sucursalId', 'disponible'],
            transaction
        });

        let { stockId, disponible } = itemStock;
        if (disponible > 0) {
            let totalFila = (Number(cantidad) * Number(unidades));
            if (disponible >= totalFila) {
                let dataStock = {
                    disponible
                };
                disponible = Number(disponible) - Number(totalFila);


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
                        let itemLoteProducto = await LoteProducto.findAll({
                            where: { productoId, sucursalId, disponible: { [Op.gt]: 0 } },
                            attributes: ['lote_productoId', 'disponible', 'cantidad_inicial', 'fecha_vencimiento'],
                            transaction,
                            order: [
                                ['fecha_vencimiento', 'ASC']
                            ]
                        });

                        if (itemLoteProducto) {
                            let pendientes = totalFila;
                            for await (let itemLote of itemLoteProducto) {
                                let { lote_productoId, cantidad_inicial, disponible: disponibleLoteProdu } = itemLote;
                                if (disponibleLoteProdu < pendientes) {
                                    pendientes -= disponibleLoteProdu;
                                    let infoLoteProduAnterior = {
                                        disponible: disponibleLoteProdu
                                    };
                                    let infoLoteProdu = {
                                        disponible: 0,
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

                                    }
                                } else {
                                    let infoLoteProduAnterior = {
                                        disponible: disponibleLoteProdu
                                    };
                                    disponibleLoteProdu = Number(disponibleLoteProdu) - Number(pendientes);
                                    let infoLoteProdu = {
                                        disponible: disponibleLoteProdu,
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

                                    }
                                    break;
                                }
                            }
                        }
                    }
                    let datosFacturaDetalle = {
                        facturaId,
                        productoId,
                        tipo_presentacionId,
                        cantidad: Number(cantidad),
                        precio: Number(precio_unitario),
                        descuento: Number(descuento),
                        impuesto: Number(totalIva),
                        sub_total: Number(totalFilaSinIva),
                        usuario_crea: usuarioId
                    };
                    await FacturaDetalle.create(datosFacturaDetalle, { transaction });
                } else {
                    listaErrores.push({
                        CodigoError: -1,
                        DescripcionError: `El producto ${nombre} con código ${codigo} ocurrió un error al actualizar el stock`
                    });
                }
            } else {
                listaErrores.push({
                    CodigoError: -1,
                    DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con la cantidad solicitada unicamente existen ${disponible}`
                });
            }
        } else {
            listaErrores.push({
                CodigoError: -1,
                DescripcionError: `El producto ${nombre} con código ${codigo} no cuenta con stock disponible`
            });
        }
    }
    if (listaErrores.length > 0) {
        response.code = -2;
        response.data = listaErrores;
        return response;
    } else {
        return await RegistrarPartidaVenta(datosValidacion, transaction);
    }
}
const RegistrarPartidaVenta = async (datosValidacion, transaction) => {
    let response = {};
    let dataPartida = [];
    let { datosUsuario, datosEmpresa, datosCliente, datosFactura } = datosValidacion;
    let { facturaId, detalle } = datosFactura;
    let { usuarioId = 0, empresaId = 0 } = datosUsuario;
    let { cuentaIdIvaPorPagar = 0, cuentaIdVentas, cuentaIdCaja } = datosEmpresa;
    let totalVenta = Number(detalle.reduce((prev, cur) => Number(prev) + (Number(cur.precioFila)) - (Number(cur.descuento)), 0)).toFixed(2);
    let totalVentaSinConIva = detalle.reduce((prev, cur) => Number(prev) + (Number(cur.totalFilaSinIva)), 0);
    let totalIvaVenta = detalle.reduce((prev, cur) => Number(prev) + (Number(cur.totalIva)), 0);
    let totalVal = Number(Number(totalVentaSinConIva) + Number(totalIvaVenta)).toFixed(2);
    if (Number(totalVal) === Number(totalVenta)) {
        dataPartida.push({
            cuenta_contableId: Number(cuentaIdCaja),
            monto: Number.parseFloat(totalVenta)
        });

        dataPartida.push({
            cuenta_contableId: Number(cuentaIdVentas),
            monto: Number.parseFloat(-totalVentaSinConIva)
        });

        dataPartida.push({
            cuenta_contableId: Number(cuentaIdIvaPorPagar),
            monto: Number.parseFloat(-totalIvaVenta)
        });

        let observaciones = `Venta de productos con factura No. ${facturaId}`;
        response = await PartidaDiario.Registrar(transaction, { detalle: dataPartida, observaciones }, usuarioId, empresaId);
        if (response.code === 1) {
            response = await CertificarDTE(datosValidacion);
            if (response.code === 1) {
                const resultado = await Factura.update(response.data, {
                    where: {
                        facturaId
                    },
                    transaction
                });
                if (resultado > 0) {
                    response.code = 1;
                    return response;
                } else {
                    response.code = -3;
                    response.data = "Por favor verifique, ya que se realizó la certificación en la SAT, pero no se logró actualizar la información en la factura local";
                    return response;
                }
            } else {
                return response;
            }
        } else {
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Los datos del total de ventas e impuestos no son validos, por favor verifique";
        return response;
    }
}

const ObtenerPdf = (stringHmtl) => {
    return new Promise((resolve, reject) => {
        var pdf = require('html-pdf');
        pdf.create(stringHmtl).toBuffer((err, buffer) => {
            if (!err) {
                resolve(buffer);
            } else {
                reject(err);
            }
        });
        // pdf.create(stringHmtl,).toFile('./businesscard.pdf', function (err, res) {
        //     if (err) return console.log(err);
        //     console.log(res); // { filename: '/app/businesscard.pdf' }
        // });
    })
}

const GenerarQR = ({ numero_autorizacion, nitEmisor, nitReceptor, monto }) => {
    return new Promise((resolve, reject) => {
        let urlQr = config.facturaElectronica.urlQr;
        urlQr = urlQr.replace("{numeroAutorizacion}", numero_autorizacion);
        urlQr = urlQr.replace("{nitEmisor}", nitEmisor);
        urlQr = urlQr.replace("{nitReceptor}", nitReceptor);
        urlQr = urlQr.replace("{monto}", Number(monto).toFixed(2));
        QRCode.toDataURL(urlQr, function (err, code) {
            if (err) {
                reject(err);
            } else {
                resolve(code);
            }
        })
    })
}
const GetDetalleFactura = async (facturaId) => {
    let response = {};
    const detalle = await bd.query(` select 
	det.cantidad,
    prod.nombre,
    det.precio,
    ifnull(det.descuento,0) as descuento,
    det.cantidad*det.precio as total 
    from factura_detalle det
    inner join cat_producto prod
    on det.productoId=prod.productoId
    where det.facturaId=${facturaId};`, {
        type: QueryTypes.SELECT
    });
    if (detalle) {
        let total = 0;
        let stringHtml = ``;
        for (let itemDetalle of detalle) {
            total += Number(Number(itemDetalle.total));
            stringHtml += `
                <tr>
                <td style="text-align: center;">${Number(itemDetalle.cantidad).toFixed(2)}</td>
                <td>${String(itemDetalle.nombre).trim()}</td>
                <td style="text-align: right;">Q${Number(itemDetalle.precio).toFixed(2)}</td>
                <td style="text-align: right;">Q${Number(itemDetalle.descuento).toFixed(2)}</td>
                <td style="text-align: right;">Q${Number(itemDetalle.total).toFixed(2)}</td>
                </tr>`;
        }
        stringHtml += `    <tr>
        <td colspan="4" style="text-align: right;">Total</td>
        <td style="text-align: right;">Q${Number(total).toFixed(2)}</td>
      </tr>`;
        response.code = 1;
        response.data = {
            total,
            stringHtml
        }
        return response;
    } else {
        response.code = -1;
        response.data = "No se logró obtener el detalle de la factura";
        return response;
    }
}
const getPdf = async (req) => {
    moment.locale('es');
    let response = {};
    const { id } = req.params;
    let { usuarioId, empresaId } = req.user;
    let itemEmpresa = await Empresa.findOne({
        where: { empresaId, estadoId: 1 },
        attributes: ['logo'],
    });
    let { logo } = itemEmpresa;
    let bufferLogo = new Buffer.from(logo);
    let base64Logo = "data:image/png;base64," + bufferLogo.toString('base64');
    let stringHmtl = ModeloFactV1;

    let datosFactura = await Factura.findOne({
        where: { facturaId: id, estadoId: 1, empresaId },
    });
    if (datosFactura) {
        let { facturaId, certificadorId, sucursalId, personaId, numero_autorizacion, serie, numeroDTE, fecha_hora_certificacion, fecha_crea } = datosFactura;
        response = await GetDatosEmpresa(empresaId);
        if (response.code === 1) {
            let datosEmpresa = response.data;
            response = await GetDatosCliente(personaId);
            if (response.code === 1) {
                let datosCliente = response.data;
                response = await GetDetalleFactura(facturaId);
                if (response.code === 1) {
                    let detalleFactura = response.data;

                    let itemCertificador = await Certificador.findOne({
                        where: { certificadorId, estadoId: 1 }
                    });
                    if (itemCertificador) {


                        stringHmtl = stringHmtl.replace("{numeroAutorizacion}", String(numero_autorizacion).trim());
                        stringHmtl = stringHmtl.replace("{serieFactura}", String(serie).trim());
                        stringHmtl = stringHmtl.replace("{numeroFactura}", String(numeroDTE).trim());
                        stringHmtl = stringHmtl.replace("{fechaHoraEmision}", moment(fecha_crea).format('LLL'));
                        stringHmtl = stringHmtl.replace("{fechaHoraCertificacion}", moment(fecha_hora_certificacion).format('LLL'));

                        let direccionEmpresa = `${datosEmpresa.direccion},${datosEmpresa.municipio},${datosEmpresa.departamento}`;
                        stringHmtl = stringHmtl.replace("{logoEmpresa}", String(base64Logo).trim());
                        stringHmtl = stringHmtl.replace("{nombreComercial}", String(datosEmpresa.nombre_comercial).trim());
                        stringHmtl = stringHmtl.replace("{razonSocial}", String(datosEmpresa.razon_social).trim());
                        stringHmtl = stringHmtl.replace("{nitEmpresa}", String(datosEmpresa.nit).trim());
                        stringHmtl = stringHmtl.replace("{direccionEmpresa}", String(direccionEmpresa).trim());
                        stringHmtl = stringHmtl.replace("{notaPiePaginaFactura}", String(datosEmpresa.nota_pie_factura).trim());


                        let base64Qr = await GenerarQR({
                            numero_autorizacion,
                            nitEmisor: datosEmpresa.nit,
                            nitReceptor: datosCliente.nit,
                            monto: detalleFactura.total
                        });
                        stringHmtl = stringHmtl.replace("{qrDatosFactura}", String(base64Qr).trim());

                        let { nombre, nit } = itemCertificador;
                        stringHmtl = stringHmtl.replace("{nombreCertificador}", String(nombre).trim());
                        stringHmtl = stringHmtl.replace("{nitCertificador}", String(nit).trim());
                        stringHmtl = stringHmtl.replace("{nombreCliente}", String(datosCliente.nombre).trim());
                        stringHmtl = stringHmtl.replace("{nitCliente}", String(datosCliente.nit).trim());
                        let direccionCliente = `${datosCliente.direccion},${datosCliente.municipio},${datosCliente.departamento}`;
                        stringHmtl = stringHmtl.replace("{direccionCliente}", String(direccionCliente).trim());
                        stringHmtl = stringHmtl.replace("{detalleFactura}", String(detalleFactura.stringHtml).trim());
                        const bufferPDF = await ObtenerPdf(stringHmtl);
                        if(bufferPDF){
                            response.code=1;
                            let bufferPdf=new Buffer.from(bufferPDF);
                            let base64Pdf = "data:application/pdf;base64," + bufferPdf.toString('base64');
                            response.data=base64Pdf;
                            return response;
                        }else{
                            response.code=-1;
                            response.data="Ocurrió un error al generar el pdf de la factura";
                            return response;
                        }
                    } else {
                        return response;
                    }
                } else {
                    response.code = -1;
                    response.data = "No se logró obtener la información del certificador";
                    return response;
                }
            } else {
                return response;
            }
        } else {
            return response;
        }
    } else {
        response.code = -1;
        response.data = "El código de la factura enviado no contiene información, por favor verifique";
        return response;
    }
}
module.exports = {
    insert,
    getPdf
}