const moment = require('moment');
const { Stock, Sucursal, Estado } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 38;
const Modelo = Stock;
const tabla = 'stock';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId } = req.user;
    req.body.usuario_crea = usuarioId;

    let transaction;
    try {
        transaction = await Modelo.sequelize.transaction();
        let { productoId, sucursalId, minimo, maximo } = req.body;
        let data = {
            productoId,
            sucursalId,
            minimo,
            maximo,
            estadoId: 1,
            usuario_crea: usuarioId
        }
        let existe = await Modelo.findOne({
            where: { productoId, sucursalId },
            attributes: ['stockId', 'estadoId'],
            transaction
        });
        if (existe) {
            let { estadoId, stockId } = existe;
            if (estadoId === 1) {
                response.code = 0;
                response.data = "El producto ya tiene stock asignado en la sucursal";
                await transaction.rollback();
            } else {
                const resultado = await Modelo.update(data, {
                    where: {
                        stockId
                    },
                    transaction
                });
                if (resultado > 0) {
                    await registrarBitacora(req,tabla, stockId, existe.dataValues, data);
                    let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                    const updateFecha = {
                        fecha_ult_mod,
                        usuario_ult_mod: usuarioId
                    }
                    const resultadoUpdateFecha = await Modelo.update(updateFecha, {
                        where: {
                            stockId
                        },
                        transaction
                    });

                    response.code = 1;
                    response.data = "El producto ya contaba con stock asignado en la sucursal, únicamente se realizó una actualización";
                    await transaction.commit();
                } else {
                    response.code = -1;
                    response.data = "El producto ya cuenta con stock en la sucursal";
                    await transaction.rollback();
                }
            }
        } else {
            const result = await Modelo.create(data, { transaction });
            response.code = 1;
            response.data = result;
            await transaction.commit();
        }
    } catch (error) {
        await transaction.rollback();
        response.code = -1;
        response.data = error;
    }


    return response;
}

const consultar = async (query, include = 1) => {
    if (include == 1) {
        if (query) {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                },
                {
                    model: Sucursal,
                    as: "Sucursal",
                    required: true,
                    attributes: ['nombre'],
                }
                ],
                where: [query],
                order: [
                    ['stockId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                }, {
                    model: Sucursal,
                    as: "Sucursal",
                    required: true,
                    attributes: ['nombre'],
                }
                ],
                order: [
                    ['stockId', 'ASC']
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
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId && !req.query.productoId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId,productoId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }
    if(productoId){
        query.productoId=productoId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.stockId = Number(id);
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

const update = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let transaction;
    try {
        transaction = await Modelo.sequelize.transaction();
        let { minimo, maximo, estadoId } = req.body;
        let data = {
            minimo,
            maximo,
            estadoId
        }

        const { id: stockId } = req.params;

        const dataAnterior = await Modelo.findOne({
            where: { stockId }
        });


        if (dataAnterior) {
            const resultado = await Modelo.update(data, {
                where: {
                    stockId
                },
                transaction
            });
            if (resultado > 0) {
                let { usuarioId } = req.user;
                data.usuario_ult_mod = usuarioId;
                await registrarBitacora(req,tabla, stockId, dataAnterior.dataValues, data);

                //Actualizar fecha de ultima modificacion
                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                const dataUpdFecha = {
                    fecha_ult_mod,
                    usuario_ult_mod: usuarioId
                }
                const resultadoUpdateFecha = await Modelo.update(dataUpdFecha, {
                    where: {
                        stockId
                    },
                    transaction
                });

                response.code = 1;
                response.data = "Información Actualizado exitosamente";
                await transaction.commit();
                return response;
            } else {
                response.code = 0;
                response.data = "No existen cambios para aplicar";
                await transaction.rollback();
                return response;
            }
        } else {
            response.code = -1;
            response.data = "No existe información para actualizar con los parametros especificados";
            await transaction.rollback();
            return response;
        }
    } catch (error) {
        await transaction.rollback();
        response.code = -1;
        response.data = error;
        return response;
    }
};

const eliminar = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 4);
    if (autorizado !== true) {
        return autorizado;
    }
    let stockId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { stockId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                stockId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, stockId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    stockId
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

module.exports = {
    list,
    update,
    insert,
    eliminar
}