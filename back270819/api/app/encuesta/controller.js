const moment = require('moment');
var { Op } = require('sequelize');
const { EncuestaComercio, EncuestaProducto, EncuestaComercioProducto, Municipio, Departamento } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = -1;
const Modelo = EncuestaComercio;
const tabla = 'encuesta_comercio';
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
        let { nombre, municipioId, detalle } = req.body;
        let dataComercio = {
            nombre,
            municipioId,
            usuario_crea: usuarioId
        }
        const result = await Modelo.create(dataComercio, { transaction });
        if (!result) {
            response.code = -1;
            response.data = "Ocurrió un error al intentar registrar el comercio, por favor verique, si el error persiste comuniquese con Byron López al teléfono 58868596";
            await transaction.rollback();
            return response;
        }
        const { encuesta_comercioId } = result;

        if (!detalle) {
            response.code = -1;
            response.data = "Debe de registrar el detalle de los productos cotizados";
            await transaction.rollback();
            return response;
        }

        for await (let item of detalle) {
            item.encuesta_comercioId = encuesta_comercioId;
            item.usuario_crea = usuarioId;
            await EncuestaComercioProducto.create(item, { transaction });
        }

        response.code = 1;
        response.data = "Gracias la encuesta registrada exitosamente";
        await transaction.commit();
        return response;
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
                include: [
                    {
                        model: Municipio,
                        as: "Municipio",
                        required: true,
                        attributes: ['departamentoId', 'descripcion'],
                        include: [
                            {
                                model: Departamento,
                                as: "Departamento",
                                required: true,
                                attributes: ['descripcion'],
                            }
                        ]
                    }
                ],
                where: [query],
                order: [
                    ['encuesta_comercioId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [
                    {
                        model: Municipio,
                        as: "Municipio",
                        required: true,
                        attributes: ['departamentoId', 'descripcion'],
                        include: [
                            {
                                model: Departamento,
                                as: "Departamento",
                                required: true,
                                attributes: ['descripcion'],
                            }
                        ]
                    }
                ],
                order: [
                    ['encuesta_comercioId', 'ASC']
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

const listProducto = async (req) => {
    response.code=1;
    response.data=await EncuestaProducto.findAll({ where: { estadoId: [1] } });
    return response;
}

const list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId } = req.user;
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }
    query.usuario_crea = usuarioId;

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.encuesta_comercioId = Number(id);
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
    const { id: encuesta_comercioId } = req.params;

    const dataAnterior = await Modelo.findOne({
        where: { encuesta_comercioId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                encuesta_comercioId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, encuesta_comercioId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    encuesta_comercioId
                }
            });

            response.code = 1;
            response.data = "Información Actualizado exitosamente";
            return response;
        } else {
            response.code = 0;
            response.data = "No existen cambios para aplicar";
            return response;
        }
    } else {
        response.code = -1;
        response.data = "No existe información para actualizar con los parametros especificados";
        return response;
    }
};

const eliminar = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 4);
    if (autorizado !== true) {
        return autorizado;
    }
    let encuesta_comercioId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { encuesta_comercioId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                encuesta_comercioId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, encuesta_comercioId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    encuesta_comercioId
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
    eliminar,
    listProducto
}