const moment = require('moment');
var { Op } = require('sequelize');
const { Rol, Estado} = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 11;
const Modelo = Rol;
const tabla = 'cat_rol';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId,empresaId } = req.user;

    let query={};
    query.empresaId=empresaId;
    query.nombre=req.body.nombre;
    let validacion=await validarInfo(query,'nombre');
    if(validacion.code!==1){
        return validacion;
    }

    req.body.usuario_crea = usuarioId;
    req.body.empresaId=empresaId;
    const result = await Modelo.create(req.body);
    response.code = 1;
    response.data = result;
    return response;
}

const validarInfo = async (auxWhere = {}, texto,id=undefined) => {
    auxWhere.estadoId = { [Op.ne]: 3 };
    if(id){
        auxWhere.rolId= { [Op.ne]: id};
    }
    const existe = await Modelo.findOne({ where: auxWhere, attributes: ['rolId'] });
    if (existe) {
        response.code = -1;
        response.data = `El ${texto} del rol ya existe por favor verifique`;
        return response;
    } else {
        return {
            code: 1,
            data: ''
        }
    }
}

const consultar = async (query,include=1) => {
    if (include == 1) {
        if (query) {
            return await Rol.findAll({
                include: [
                {
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion']
                }],
                where: [query],
                order: [
                    ['rolId', 'ASC']
                ]
            });
        } else {
            return await Rol.findAll({
                include: [
                {
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion']
                }],
                order: [
                    ['rolId', 'ASC']
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

list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const {empresaId}=req.user;
    let query = {};
    query.empresaId=empresaId;
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    }

    const { id, estadoId } = req.query;
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
            query.rolId = Number(id);
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
    const {empresaId}=req.user;
    const { rolId } = req.body;

    if(req.body.nombre){
    let query={};
    query.empresaId=empresaId;
    query.nombre=req.body.nombre;
    let validacion=await validarInfo(query,'nombre',rolId);
    if(validacion.code!==1){
        return validacion;
    }
}

    const dataAnterior = await Modelo.findOne({
        where: { rolId,empresaId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                rolId,
                empresaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, rolId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    rolId
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
    let rolId = req.params.id;
    let {empresaId}=req.user;
    const dataAnterior = await Modelo.findOne({
        where: { rolId,empresaId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                rolId,
                empresaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, rolId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    rolId
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
    insert,
    update,
    eliminar
}