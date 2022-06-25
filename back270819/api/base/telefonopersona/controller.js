const moment = require('moment');
var { Op } = require('sequelize');
var sequelize = require('sequelize');
const { TelefonoPersona, TipoTelefono, Estado } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId=14;
const Modelo = TelefonoPersona;
const tabla = 'telefono_persona';
let response = {};

const insert = async (req) => {
    let autorizado=await validarpermiso(req,MenuId,1);
    if(autorizado!==true){
        return autorizado;
    }

    let validacion=await validarTelefono(req);
    if(validacion.code!==1){
        return validacion;
    }
    
    let { usuarioId } = req.user;
    req.body.usuario_crea = usuarioId;
    const result = await Modelo.create(req.body);
    response.code = 1;
    response.data = result;
    return response;
}

const validarTelefono=async(req,id=undefined)=>{
    const { telefono } = req.body;
    const {empresaId}=req.user;
    let query="";
    query=`telefono_persona.estadoId!=3 and telefono_persona.telefono=${telefono} and telefono_persona.personaId in(select personaId from persona where persona.empresaId=${empresaId})`
    if(id){
        query+=` and telefono_persona.telefono_personaId!=${id}`;
    }
    
    const existe = await Modelo.findOne({ where: sequelize.literal(query), attributes: ['telefono_personaId'] });

    if (existe) {
        return {
            code: -1,
            data:"El número de teléfono ya existe por favor verifique"
        }
    }else{
        return {
            code:1
        }
    }
}

const consultar = async (query) => {
    if (query) {
        return await TelefonoPersona.findAll({
            include: [{
                model: TipoTelefono,
                as: "TipoTelefono",
                required: true,
            }, {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion']
            }],
            order: [
                ['telefono_personaId', 'ASC']
            ],
            where: [query],
            order: [
                ['telefono_personaId', 'ASC']
            ]
        });
    } else {
        return await TelefonoPersona.findAll({
            include: [{
                model: TipoTelefono,
                as: "TipoTelefono",
                required: true,
            }, {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion']
            }],
            order: [
                ['telefono_personaId', 'ASC']
            ]
        });
    }
}

list = async (req) => {
    let autorizado=await validarpermiso(req,MenuId,3);
    if(autorizado!==true){
        return autorizado;
    }
    
    if (!req.query.id && !req.query.estadoId && !req.query.personaId && !req.query.tipotelefonoId) {
        response.code = 1;
        response.data = await consultar();
        return response;
    }

    const { id, estadoId,personaId,tipotelefonoId} = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }
    if(personaId){
        query.personaId=personaId;
    }

    if(tipotelefonoId){
        query.tipo_telefonoId=tipotelefonoId;
    }


    if (!id) {
        response.code = 1;
        response.data = await consultar(query);
        return response;
    } else {
        if (Number(id) > 0) {
            query.telefono_personaId = Number(id);
            response.code = 1;
            response.data = await consultar(query);
            return response;
        } else {
            response.code = -1;
            response.data = "Debe de especificar un codigo";
            return response;
        }
    }
}

const eliminar = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 4);
    if (autorizado !== true) {
        return autorizado;
    }
    let telefono_personaId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { telefono_personaId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                telefono_personaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, telefono_personaId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    telefono_personaId
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

const update = async (req) => {
    let autorizado=await validarpermiso(req,MenuId,2);
    if(autorizado!==true){
        return autorizado;
    }
    const { telefono_personaId,telefono } = req.body;

    if (telefono) {
        let validacion=await validarTelefono(req,telefono_personaId);
        if(validacion.code!==1){
            return validacion;
        }
    }

    const dataAnterior = await Modelo.findOne({
        where: { telefono_personaId }
    });

    if (telefono) {
        const existe = await Modelo.findOne(
            {
                where:
                {
                    telefono,
                    telefono_personaId: { [Op.ne]: telefono_personaId },
                    estadoId: { [Op.ne]: 3}
                },
                attributes: ['telefono_personaId']
            });

        if (existe) {
            response.code = -1;
            response.data = "El nuevo número de teléfono ya existe por favor verifique";
            return response;
        }
    }


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                telefono_personaId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, telefono_personaId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod:usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    telefono_personaId
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

module.exports = {
    list,
    update,
    insert,
    eliminar
}