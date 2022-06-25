const moment = require('moment');
var { Op } = require('sequelize');
const sequelize=require('sequelize');
const { TelefonoContactoProveedor, TipoTelefono, Estado } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 31;
const Modelo = TelefonoContactoProveedor;
const tabla = 'cat_telefono_contacto_proveedor';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { telefono } = req.body;
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
    query=`cat_telefono_contacto_proveedor.estadoId!=3 and cat_telefono_contacto_proveedor.telefono=${telefono} and cat_telefono_contacto_proveedor.contacto_proveedorId in(select contacto_proveedorId from cat_contacto_proveedor where proveedorId in(select proveedorId from cat_proveedor where empresaId=${empresaId}))`
    if(id){
        query+=` and cat_telefono_contacto_proveedor.telefono_contacto_proveedorId!=${id}`;
    }
    
    const existe = await Modelo.findOne({ where: sequelize.literal(query), attributes: ['telefono_contacto_proveedorId'] });

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
                    model: TipoTelefono,
                    as: "TipoTelefono",
                    required: true,
                    attributes: ['descripcion'],
                }
                ],
                where: [query],
                order: [
                    ['telefono_contacto_proveedorId', 'ASC']
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
                    model: TipoTelefono,
                    as: "TipoTelefono",
                    required: true,
                    attributes: ['descripcion'],
                }],
                order: [
                    ['telefono_contacto_proveedorId', 'ASC']
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
    if (!req.query.id && !req.query.estadoId && !req.query.contacto_proveedorId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId,contacto_proveedorId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }
    if(contacto_proveedorId){
        query.contacto_proveedorId=contacto_proveedorId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.telefono_contacto_proveedorId = Number(id);
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
    const { id: telefono_contacto_proveedorId } = req.params;

    let validacion=await validarTelefono(req,telefono_contacto_proveedorId);
    if(validacion.code!==1){
        return validacion;
    }


    const dataAnterior = await Modelo.findOne({
        where: { telefono_contacto_proveedorId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                telefono_contacto_proveedorId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, telefono_contacto_proveedorId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    telefono_contacto_proveedorId
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
    let telefono_contacto_proveedorId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { telefono_contacto_proveedorId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                telefono_contacto_proveedorId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, telefono_contacto_proveedorId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    telefono_contacto_proveedorId
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