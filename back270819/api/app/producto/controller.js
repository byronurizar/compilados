const moment = require('moment');
var sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
var { Op } = require('sequelize');
const { Producto, Estado, Categoria, TipoProducto, ProductoTipoPresentacion, TipoPresentacion, bd, UsuarioSucursal } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 36;
const MenuIdProductoTipoPresentacion = 3600;
const Modelo = Producto;
const tabla = 'cat_producto';

const insert = async (req) => {
    let result = {};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId, empresaId } = req.user;
    req.body.usuario_crea = usuarioId;
    req.body.empresaId = empresaId;
    let { codigo, tipoPresentacion = undefined } = req.body;
    codigo = String(codigo).trim();
    let query = {};
    query.empresaId = empresaId;
    query.nombre = String(req.body.nombre).trim();
    if (!tipoPresentacion) {
        result.code = 0;
        result.data = "Debe de enviarse información de tipos de presentación";
        return result;
    }

    let validacion = await validarInfo(query, 'nombre');
    if (validacion.code !== 1) {
        return validacion;
    }
    const itemExiste = await Modelo.findOne({ where: { codigo, empresaId } });
    if (itemExiste) {
        result.code = 0;
        result.data = "El código de barra " + codigo + " ya esta asignado a otro producto, por favor verifique";
        return result;
    } else {
        let transaction;
        try {
            transaction = await Producto.sequelize.transaction();
            let dataBody = req.body;
            let dataProducto = {
                empresaId: empresaId,
                categoriaId: dataBody.categoriaId,
                tipo_productoId: dataBody.tipo_productoId,
                codigo: dataBody.codigo.trim(),
                nombre: dataBody.nombre.trim(),
                descripcion: dataBody.descripcion.trim(),
                precio: 0,
                costo: 0,
                puede_ser_vendido: dataBody.puede_ser_vendido,
                puede_ser_comprado: dataBody.puede_ser_comprado,
                perecedero: dataBody.perecedero,
                usuario_crea: usuarioId,
                estadoId: 1
            };

            let insertProducto = await Producto.create(dataProducto, { transaction });
            if (insertProducto) {
                let { productoId } = insertProducto;
                if (tipoPresentacion.length > 0) {
                    let itemExisteCantidadCero = tipoPresentacion.filter(i => Number(i.unidades) <= 0);
                    if (itemExisteCantidadCero.length > 0) {
                        await transaction.rollback();
                        return {
                            code: -1,
                            data: "No es posible registrar los tipos de presentación, con unidades menores a cero por favor verfique"
                        }
                    }

                    let itemsExisteDefaultVenta = tipoPresentacion.filter(i => Boolean(i.default_venta) === true);
                    if ((itemsExisteDefaultVenta && itemsExisteDefaultVenta.length > 0 && itemsExisteDefaultVenta.length > 1) || itemsExisteDefaultVenta.length === 0) {
                        await transaction.rollback();
                        return {
                            code: -1,
                            data: "Debe de existir un valor por default para realizar las ventas"
                        }
                    }

                    let itemsExisteDefaultCompra = tipoPresentacion.filter(i => Boolean(i.default_compra) === true);
                    if ((itemsExisteDefaultCompra && itemsExisteDefaultCompra.length > 0 && itemsExisteDefaultCompra.length > 1) || itemsExisteDefaultCompra.length === 0) {
                        await transaction.rollback();
                        return {
                            code: -1,
                            data: "Debe de existir un valor por default para realizar las compras"
                        }
                    }

                    let listProductoTipoPresentacion = [];
                    for (let tipo of tipoPresentacion) {
                        let existeItem = listProductoTipoPresentacion.find(i => Number(i.tipo_presentacionId) === Number(tipo.tipo_presentacionId))
                        if (existeItem) {
                            result.code = -1;
                            result.data = "Los tipos de presentación no deben de estar duplicados por favor verifique";
                            return result;
                        } else {
                            listProductoTipoPresentacion.push(tipo);
                        }
                    }
                    let totalTipoPresentacion = 0;
                    for await (let { tipo_presentacionId, precio_compra, precio_venta, unidades, default_compra, default_venta } of listProductoTipoPresentacion) {
                        if (Number(precio_compra) <= 0 || precio_venta <= 0) {
                            await transaction.rollback();
                            result.code = -1;
                            result.data = "Por favor verifique que el precio de compra y de venta de los tipos de presentaciones enviados sean mayores a 0";
                            return result;
                        }

                        let itemInsert = {
                            productoId,
                            tipo_presentacionId,
                            precio_compra,
                            precio_venta,
                            unidades,
                            default_compra: default_compra,
                            default_venta: default_venta,
                            usuario_crea: usuarioId
                        }
                        let insertItem = await ProductoTipoPresentacion.create(itemInsert, { transaction });
                        if (insertItem) {
                            totalTipoPresentacion++;
                        } else {
                            await transaction.rollback();
                            result.code = -1;
                            result.data = "Ocurrió un error al intentar registrar un tipo de presentación por favor verifque que los datos sean correctos";
                            return result;
                        }

                    }
                    if (Number(totalTipoPresentacion) > 0) {
                        let items = await ProductoTipoPresentacion.findAll({
                            where: { productoId },
                            transaction
                        });

                        await transaction.commit();
                        result.code = 1;
                        result.data = "Producto registrado exitosamente";
                        return result;
                    }
                } else {
                    await transaction.rollback();
                    result.code = 0;
                    result.data = "Información de tipo de presentación no es válida";
                    return result;
                }
            } else {
                await transaction.rollback();
                result.code = -1;
                result.data = "Ocurrió un error al intentar registrar el producto";
                return result;
            }
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    }
}
const validarInfo = async (auxWhere = {}, texto, id = undefined) => {
    let response = {};
    auxWhere.estadoId = { [Op.ne]: 3 };
    if (id) {
        auxWhere.productoId = { [Op.ne]: id };
    }

    const existe = await Modelo.findOne({ where: auxWhere, attributes: ['productoId'] });
    if (existe) {
        response.code = -1;
        response.data = `El ${texto} del producto ya existe por favor verifique`;
        return response;
    } else {
        return {
            code: 1,
            data: ''
        }
    }
}
const consultar = async (query, include = 1) => {
    if (include == 1) {
        if (query) {
            return await Modelo.findAll({
                include: [{
                    model: ProductoTipoPresentacion,
                    as: "TipoPresentacion",
                    required: true,
                    attributes: {
                        exclude: ["usuario_ult_mod", "fecha_ult_mod", "usuario_crea", "fecha_crea"],
                    },
                    include: [
                        {
                            model: TipoPresentacion,
                            as: "TipoPresentacion",
                            required: true,
                            attributes: ['nombre', 'descripcion'],
                        }
                    ]
                }, {
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                },
                {
                    model: Categoria,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre', 'descripcion'],
                },
                {
                    model: TipoProducto,
                    as: "TipoProducto",
                    required: true,
                    attributes: ['descripcion']
                }
                ],
                where: [query],
                order: [
                    ['productoId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: ProductoTipoPresentacion,
                    as: "TipoPresentacion",
                    required: true,
                    attributes: {
                        exclude: ["usuario_ult_mod", "fecha_ult_mod", "usuario_crea", "fecha_crea"],
                    },
                    include: [
                        {
                            model: TipoPresentacion,
                            as: "TipoPresentacion",
                            required: true,
                            attributes: ['nombre', 'descripcion'],
                        }
                    ]
                }, {
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                },
                {
                    model: Categoria,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre', 'descripcion'],
                },
                {
                    model: TipoProducto,
                    as: "TipoProducto",
                    required: true,
                    attributes: ['descripcion']
                }
                ],
                order: [
                    ['productoId', 'ASC']
                ]
            });
        }
    } else {
        if (query) {
            return await Modelo.findAll({ where: query });
        } else {
            return await Modelo.findAll();
        }
    }
}
const list = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const { include } = req.query;
    const { empresaId } = req.user;
    let query = {};

    query.empresaId = empresaId;
    if (!req.query.id && !req.query.estadoId && !req.query.categoriaId && !req.query.codigo && !req.query.tipo_productoId) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    }

    const { id, estadoId, categoriaId, codigo, tipo_productoId } = req.query;

    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

    if (categoriaId) {
        query.categoriaId = categoriaId;
    }
    if (codigo) {
        query.codigo = codigo;
    }
    if (tipo_productoId) {
        query.tipo_productoId = tipo_productoId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.productoId = Number(id);
            response.code = 1;
            response.data = await consultar(query, include);
            return response;
        } else {
            response.code = -1;
            response.data = "Debe de especificar un codigo";
            return response;
        }
    }
}
const filtrar = async (req) => {
    let resultado = {};
    let { criterio } = req.body;
    if (String(criterio).trim().length > 0) {
        criterio = criterio.trim();
        resultado.code = 1;
        resultado.data = await Producto.findAll({
            where: sequelize.literal(`codigo='${criterio}' or nombre like '%${criterio}%'`),
        });
    } else {
        resultado.code = 0;
        resultado.data = "Debe de ingresar el código o el nombre del producto";
    }
    return resultado;
}
const update = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let nuevosTiposPresentacion = [];
    const { id: productoId } = req.params;
    const { empresaId } = req.user;
    const usuario_ult_mod = req.user.usuarioId;
    let {
        codigo,
        nombre,
        descripcion,
        puede_ser_vendido,
        puede_ser_comprado,
        perecedero,
        estadoId,
        tipoPresentacion } = req.body;

    delete req.body.tipoPresentacion;
    if (nombre) {
        nombre = String(nombre).trim();
        let query = {};
        query.empresaId = empresaId;
        query.nombre = String(req.body.nombre).trim();
        let validacion = await validarInfo(query, 'nombre', productoId);
        if (validacion.code !== 1) {
            return validacion;
        }
    }

    if (codigo) {
        codigo = String(codigo).trim();
        if (codigo.length <= 0) {
            response.code = 0;
            response.data = "El código de barra del producto no puede estar nulo";
            return response;
        }
        query = {};
        query.empresaId = empresaId;
        query.codigo = String(req.body.codigo).trim();
        let validacion = await validarInfo(query, 'codigo', productoId);
        if (validacion.code !== 1) {
            return validacion;
        }
    }

    if (tipoPresentacion) {
        if (tipoPresentacion.length > 0) {
            let autorizado = await validarpermiso(req, MenuIdProductoTipoPresentacion, 1);
            if (autorizado !== true) {
                return autorizado;
            }

            let existenDuplicados = false;
            tipoPresentacion.map(item => {
                let existe = nuevosTiposPresentacion.find(i => Number(i.tipo_presentacionId) === Number(item.tipo_presentacionId));
                if (existe) {
                    existenDuplicados = true;
                }
                delete item.nombre;
                delete item.default_compra;
                delete item.default_venta;
                nuevosTiposPresentacion.push(item);
            });
            if (existenDuplicados) {
                return {
                    code: -1,
                    data: "Los tipos de presentación no pueden estar duplicados, por favor verifique"
                }
            }
            let itemExisteCantidadCero = nuevosTiposPresentacion.filter(i => Number(i.unidades) <= 0);
            if (itemExisteCantidadCero.length > 0) {
                return {
                    code: -1,
                    data: "No es posible registrar los tipos de presentación, con unidades menores a cero por favor verfique"
                }
            }
            let existe = nuevosTiposPresentacion.filter(i => Number(i.precio_compra) <= 0 || Number(i.precio_venta) <= 0);
            if (existe.length > 0) {
                return {
                    code: -1,
                    data: "Por favor verifique que el precio de compra y de venta de los tipos de presentaciones enviados sean mayores a 0"
                }
            }
        }
    }
    let transaction;
    try {
        transaction = await Producto.sequelize.transaction();

        const dataAnterior = await Modelo.findOne({
            where: { productoId, empresaId },
            transaction
        });

        if (dataAnterior) {
            for await (let { producto_tipo_presentacionId = 0, tipo_presentacionId, precio_compra, precio_venta, estadoId, unidades } of nuevosTiposPresentacion) {
                let itemTipoPresentacion = {};
                if (Number(producto_tipo_presentacionId) > 0) {
                    itemTipoPresentacion = await ProductoTipoPresentacion.findOne({
                        where: { producto_tipo_presentacionId, productoId, tipo_presentacionId },
                        transaction
                    });
                    if (!itemTipoPresentacion) {
                        await transaction.rollback();
                        response.code = -1;
                        response.data = "La información enviado no corresponde al producto";
                        return response;
                    }
                }
                let { producto_tipo_presentacionId: idActual = 0 } = itemTipoPresentacion;
                if (Number(idActual) > 0) {
                    const resultUpdate = await ProductoTipoPresentacion.update({
                        precio_compra,
                        precio_venta,
                        estadoId
                    }, {
                        where: {
                            producto_tipo_presentacionId, productoId
                        },
                        transaction
                    });
                    if (resultUpdate > 0) {
                        let dataNueva = {
                            precio_compra: Number(precio_compra).toFixed(2),
                            precio_venta: Number(precio_venta).toFixed(2),
                            estadoId,
                            usuario_ult_mod
                        };
                        if (await registrarBitacora(req, 'producto_tipo_presentacion', producto_tipo_presentacionId, itemTipoPresentacion.dataValues, dataNueva, transaction) !== true) {
                            await transaction.rollback();
                            response.code = -1;
                            response.data = "Ocurrió un error en el registro de bitacora de cambios, al momento de intentar actualizar en Tipos de Presentación de Producto";
                            return response;
                        }
                        let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                        const dataTipoPresentacion = {
                            fecha_ult_mod,
                            usuario_ult_mod: usuario_ult_mod
                        }
                        const resultadoUpdateFecha = await ProductoTipoPresentacion.update(dataTipoPresentacion, {
                            where: {
                                producto_tipo_presentacionId, productoId
                            },
                            transaction
                        });
                    }
                } else {
                    let existe = await ProductoTipoPresentacion.findOne({
                        where: { productoId, tipo_presentacionId },
                        transaction
                    });
                    if (existe) {
                        await transaction.rollback();
                        response.code = -1;
                        response.data = "No deben de existir tipos de presentación duplicados";
                        return response;
                    } else {
                        let dataNewItem = {
                            productoId,
                            tipo_presentacionId,
                            precio_compra,
                            precio_venta,
                            unidades,
                            usuario_crea: usuario_ult_mod
                        };
                        let insertTipoPresentacionProdu = await ProductoTipoPresentacion.create(dataNewItem, { transaction });
                        let { tipo_presentacionId: IdNewItem } = insertTipoPresentacionProdu;
                        if (!IdNewItem) {
                            await transaction.rollback();
                            response.code = -1;
                            response.data = "Ocurrió un error al intentar agregar nuevo tipo de presentación";
                            return response;
                        }
                    }
                }
            }

            const resultado = await Modelo.update({
                codigo,
                nombre,
                descripcion,
                puede_ser_vendido,
                puede_ser_comprado,
                perecedero,
                estadoId
            }, {
                where: {
                    productoId, empresaId
                },
                transaction
            });

            if (resultado > 0) {
                let { usuarioId } = req.user;
                req.body.usuario_ult_mod = usuarioId;
                await registrarBitacora(req, tabla, productoId, dataAnterior.dataValues, req.body, transaction);

                //Actualizar fecha de ultima modificacion
                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                const data = {
                    fecha_ult_mod,
                    usuario_ult_mod: usuarioId
                }
                const resultadoUpdateFecha = await Modelo.update(data, {
                    where: {
                        productoId
                    },
                    transaction
                });
            }
            response.code = 1;
            response.data = "Información Actualizado exitosamente";
            await transaction.commit();
            return response;
        } else {
            await transaction.rollback();
            response.code = -1;
            response.data = "No existe información para actualizar con los parametros especificados";
            return response;
        }

    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
};

const eliminar = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 4);
    if (autorizado !== true) {
        return autorizado;
    }
    const { empresaId } = req.user;
    let productoId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { productoId, empresaId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                productoId, empresaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req, tabla, productoId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    productoId
                }
            });

            response.code = 1;
            response.data = "Elemento eliminado exitosamente";
            return response;
        } else {
            response.code = -1;
            response.data = "No fue posible eliminar el elemento";
            return response;
        }
    } else {
        response.code = -1;
        response.data = "No existe información para eliminar con los parametros especificados";
        return response;
    }

}

const validar = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let { tipo = '', productoId = 0 } = req.body;
    if (productoId > 0) {
        if (String(tipo).trim().length > 0) {
            switch (tipo) {
                case 'tipo_presentacion':
                    response.data = await ProductoTipoPresentacion.findAll({
                        where: { productoId, estadoId: 1 },
                        attributes: ['tipo_presentacionId', 'unidades', 'precio_compra', 'precio_venta', 'default_compra', 'default_venta'],
                        include: [
                            {
                                model: TipoPresentacion,
                                as: "TipoPresentacion",
                                required: true,
                                attributes: ['tipo_presentacionId', 'nombre'],
                            }
                        ]
                    });
                    response.code = 1;
                    break;
                default:
                    response.code = -1;
                    response.data = "Tipo de valicación no valido";
                    break;
            }
        } else {
            response.code = -1;
            response.data = "Código de producto no valido";
        }
    } else {
        response.code = -1;
        response.data = "Para poder completar las validaciones del producto es necesario que se envié el tipo de valicación";
    }
    return response;
}
const filtrarFacturacion = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let {
        sucursalId = 0,
        criterio = ""
    } = req.body;

    const { empresaId, usuarioId } = req.user;
    if (sucursalId > 0) {
        criterio=String(criterio).trim();
        if (String(criterio).length > 0) {
            let itemUsuarioSucursal = await UsuarioSucursal.findOne({
                where: { usuarioId, sucursalId, estadoId: 1 }
            });
            if (itemUsuarioSucursal) {
                const result_products = await bd.query(`
        select 
        prod.productoId,
        prod.codigo,
        prod.nombre as nombreProducto,
        prod.descripcion as descripcionProducto,
        catTipoPres.descripcion as tipoPresentacion,
        tipoPres.precio_venta,
        tipoPres.unidades,
        stock.disponible,
        tipoPres.tipo_presentacionId as tipo_presentacionId,
        0 as descuento
        from cat_producto prod
        inner join producto_tipo_presentacion tipoPres
        on prod.productoId=tipoPres.productoId and tipoPres.estadoId=1 and tipoPres.precio_venta>0
        inner join cat_tipo_presentacion catTipoPres
        on tipoPres.tipo_presentacionId=catTipoPres.tipo_presentacionId and catTipoPres.estadoId=1 and default_venta=1
        inner join stock stock
        on prod.productoId=stock.productoId and stock.estadoId=1 and stock.disponible>0
        where prod.puede_ser_vendido=1 and stock.sucursalId=${sucursalId} and prod.codigo='${criterio}' or prod.nombre like '%${criterio}%';
    `, {
                    type: QueryTypes.SELECT
                });
                response.code = 1;
                response.data = result_products;
            } else {
                response.code = 0;
                response.data = "La sucursal enviada no es valida";
            }
        } else {
            response.code = 0;
            response.data = "Debe de enviar un criterio de búsqueda";
        }
    } else {
        response.code = 0;
        response.data = "Para poder realizar la búsqueda debe de enviar la sucursal";
    }
    return response;
}
module.exports = {
    list,
    filtrar,
    update,
    insert,
    eliminar,
    validar,
    filtrarFacturacion
}