const { Estado, CatCategoriaGrupoGasto } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
var { Op } = require('sequelize');
const MenuId = 9;
const Modelo = CatCategoriaGrupoGasto;
const tabla = 'cat_categoria_grupo_gasto';
const insert = async (req) => {
    let response={};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId, grupo_gastoId } = req.user;
    let { nombre } = req.body;
    nombre = String(nombre).trim().toUpperCase();
    let datos = {
        nombre,
        grupo_gastoId,
        usuario_crea: usuarioId
    };
    const existe = await Modelo.findOne({ where: { nombre, grupo_gastoId, estadoId: { [Op.ne]: 3 } }, attributes: ['categoriaId'] });
    if (existe) {
        response.code = 0;
        response.data = `La categoría ${nombre} ya existe, por favor verifique`;
        return response;
    }
    const result = await Modelo.create(datos);
    if (result) {
        response.code = 1;
        response.data = "Categoría registrada exitosamente";
    } else {
        response.code = 1;
        response.data = "Ocurrió un error al intentar registrar la categoría";
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
                }],
                where: [query],
                order: [
                    ['categoriaId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                }],
                order: [
                    ['categoriaId', 'ASC']
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
    let response={};
    let { usuarioId, grupo_gastoId } = req.user;
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }

    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId } = req.query;
    let query = {};
    query.grupo_gastoId=grupo_gastoId;
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

      if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.categoriaId = Number(id);
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
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let { categoriaId, nombre, estadoId } = req.body;
    let { usuarioId,grupo_gastoId } = req.user;
    let newData = {
        nombre: String(nombre).trim().toUpperCase(),
        estadoId
    };

    const existe = await Modelo.findOne({ 
            where: { nombre, 
                    grupo_gastoId, 
                    estadoId: { [Op.ne]: 3 },
                    categoriaId: { [Op.ne]: categoriaId 
                    } 
                }, 
            attributes: ['categoriaId'] 
        });
    if (existe) {
        response.code = 0;
        response.data = `La categoría ${nombre} ya existe, por favor verifique`;
        return response;
    }

    const dataAnterior = await Modelo.findOne({
        where: { categoriaId, grupo_gastoId }
    });

    if (dataAnterior) {
        const resultado = await Modelo.update(newData, {
            where: {
                categoriaId, grupo_gastoId
            }
        });
        if (resultado > 0) {

            newData.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, categoriaId, dataAnterior.dataValues, newData);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    categoriaId
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
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let response={};
    let { grupo_gastoId } = req.user;
    let categoriaId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { categoriaId,grupo_gastoId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                categoriaId,grupo_gastoId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, categoriaId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    categoriaId,
                    grupo_gastoId
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