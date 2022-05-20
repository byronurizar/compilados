const moment = require('moment');
const { QueryTypes } = require('sequelize');
const sequelize = require('sequelize');
const { PerfilAccesoGrupoGasto,CatAccessoGrupoGasto, Estado, bd } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 20;
const Modelo = PerfilAccesoGrupoGasto;
const tabla = 'perfil_acceso_grupo_gasto';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId } = req.user;
    const{perfilId,accesoId}=req.body;
    const dataActual = await Modelo.findOne({
        where: { perfilId,accesoId }
    });

    if(!dataActual){
        let datosReq={
            perfilId,
            accesoId,
            usuario_crea:usuarioId
        };
        const result = await Modelo.create(datosReq);
        response.code = 1;
        response.data = "Acceso asignado al perfil exitosamente";
    }else{
        response.code = -1;
        response.data = "El perfil ya tiene asignado el acceso";
    }
    return response;
}

const consultar = async (query, include = 1) => {
    if (include == 1) {
        if (query) {
            return await Modelo.findAll({
                include: [{
                    model: CatAccessoGrupoGasto,
                    as: "Acceso",
                    required: true,
                    attributes: ['descripcion'],
                },{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                }],
                where: [query],
                order: [
                    ['serialId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: CatAccessoGrupoGasto,
                    as: "Acceso",
                    required: true,
                    attributes: ['descripcion'],
                },{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                }],
                order: [
                    ['serialId', 'ASC']
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
    if (!req.query.id && !req.query.estadoId && !req.query.perfilId) {
        response.code = 1;
        response.data = await consultar(null,include);
        return response;
    }

    const { id, estadoId,perfilId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

    if(perfilId){
        query.perfilId = perfilId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query,include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.tipo_documentoId = Number(id);
            response.code = 1;
            response.data = await consultar(query,include);
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
    const { serialId,accesoId,estadoId } = req.body;
    const dataAnterior = await Modelo.findOne({
        where: { serialId }
    });


    if (dataAnterior) {
        const {accesoId:accesoIdActual,perfilId }=dataAnterior;

        const validarAcceso = await Modelo.findOne({
            where: { accesoId:accesoIdActual,perfilId }
        });

        if(validarAcceso && accesoId!==accesoIdActual){
            response.code = 0;
            response.data = "El acceso que intenta actualizar, el perfil ya lo tiene asignado por favor verifique";
            return response;
        }
        let dataNueva={
            accesoId,
            estadoId
        }
        const resultado = await Modelo.update(dataNueva, {
            where: {
                serialId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataNueva.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, serialId, dataAnterior.dataValues, dataNueva);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod:usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    serialId,
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
    let serialId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { serialId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                serialId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, serialId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    serialId
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