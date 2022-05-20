const { Estado, CatCategoriaGrupoGasto, SubCategoriaGrupoGasto } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
var { Op } = require('sequelize');
const MenuId = 9;
const Modelo = SubCategoriaGrupoGasto;
const tabla = 'cat_sub_categoria_grupo_gasto';
const insert = async (req) => {
    let response={};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId } = req.user;
    let { nombre,categoriaId } = req.body;
    nombre = String(nombre).trim().toUpperCase();
    let datos = {
        nombre,
        categoriaId,
        usuario_crea: usuarioId
    };
    const existe = await Modelo.findOne({ where: { nombre, categoriaId, estadoId: { [Op.ne]: 3 } }, attributes: ['sub_categoriaId'] });
    if (existe) {
        response.code = 0;
        response.data = `La sub categoría ${nombre} ya existe para esta categoria, por favor verifique`;
        return response;
    }
    const result = await Modelo.create(datos);
    if (result) {
        response.code = 1;
        response.data = "Sub categoría registrada exitosamente";
    } else {
        response.code = 1;
        response.data = "Ocurrió un error al intentar registrar la sub categoría";
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
                },{
                    model: CatCategoriaGrupoGasto,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre'],
                }],
                where: [query],
                order: [
                    ['sub_categoriaId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                },{
                    model: CatCategoriaGrupoGasto,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre'],
                }],
                order: [
                    ['sub_categoriaId', 'ASC']
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
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }

    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId && !req.query.categoriaId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId,categoriaId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

    if(categoriaId){
        query.categoriaId=categoriaId;
    }

      if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.sub_categoriaId = Number(id);
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
    let { sub_categoriaId, nombre, estadoId } = req.body;
    let { usuarioId } = req.user;
    let newData = {
        nombre: String(nombre).trim().toUpperCase(),
        estadoId
    };

    const existe = await Modelo.findOne({ 
            where: { nombre, 
                    estadoId: { [Op.ne]: 3 },
                    sub_categoriaId: { [Op.ne]: sub_categoriaId 
                    } 
                }, 
            attributes: ['sub_categoriaId'] 
        });
    if (existe) {
        response.code = 0;
        response.data = `La categoría ${nombre} ya existe, por favor verifique`;
        return response;
    }

    const dataAnterior = await Modelo.findOne({
        where: { sub_categoriaId }
    });

    if (dataAnterior) {
        const resultado = await Modelo.update(newData, {
            where: {
                sub_categoriaId
            }
        });
        if (resultado > 0) {

            newData.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, sub_categoriaId, dataAnterior.dataValues, newData);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    sub_categoriaId
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
    let sub_categoriaId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { sub_categoriaId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                sub_categoriaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, sub_categoriaId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    sub_categoriaId
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