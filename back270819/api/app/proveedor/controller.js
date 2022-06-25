const moment = require('moment');
var { Op } = require('sequelize');
const { Proveedor, Estado, Municipio, Departamento } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 29;
const Modelo = Proveedor;
const tabla = 'cat_proveedor';
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

    query={};
    query.empresaId=empresaId;
    query.email=req.body.email;
    validacion=await validarInfo(query,'correo');
    if(validacion.code!==1){
        return validacion;
    }

    let { nit } = req.body;
    nit = nit.replace("-", "").trim();
    req.body.nit=nit;
    const existe = await Modelo.findOne({ where: { nit,empresaId, estadoId: { [Op.ne]: 3 } }, attributes: ['proveedorId'] });
    if (existe) {
        response.code = -1;
        response.data = "El nit del proveedor ya existe, por favor verifique";
        return response;
    }
    else {
        
        req.body.usuario_crea = usuarioId;
        req.body.empresaId=empresaId;
        const result = await Modelo.create(req.body);
        response.code = 1;
        response.data = result;
        return response;
    }
}

const validarInfo=async(auxWhere={},texto,id=undefined)=>{
    auxWhere.estadoId={ [Op.ne]: 3};
    if(id){
        auxWhere.proveedorId= { [Op.ne]: id};
    }

    const existe = await Modelo.findOne({ where: auxWhere, attributes: ['proveedorId'] });
    if (existe) {
        response.code = -1;
        response.data = `El ${texto} del proveedor ya existe por favor verifique`;
        return response;
    }else{
        return {
            code:1,
            data:''
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
                    model: Municipio,
                    as: "Municipio",
                    required: true,
                    attributes: ['descripcion','departamentoId'],
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
                    ['proveedorId', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                },
                {
                    model: Municipio,
                    as: "Municipio",
                    required: true,
                    attributes: ['descripcion','departamentoId'],
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
                    ['proveedorId', 'ASC']
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
    const {empresaId}=req.user;
    let query = {};
    query.empresaId=empresaId;
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId) {
        response.code = 1;
        response.data = await consultar(null, include);
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
            query.proveedorId = Number(id);
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
    const { id: proveedorId } = req.params;
    
    let { usuarioId,empresaId } = req.user;
    const {nit,nombre,email} = req.body;
    
    let query={};
    if(nombre){
    query.empresaId=empresaId;
    query.nombre=req.body.nombre;
    let validacion=await validarInfo(query,'nombre',proveedorId);
    if(validacion.code!==1){
        return validacion;
    }
    }
    if(email){
    query={};
    query.empresaId=empresaId;
    query.email=req.body.email;
    validacion=await validarInfo(query,'correo',proveedorId);
    if(validacion.code!==1){
        return validacion;
    }
    }
    if (nit) {
        const existe = await Modelo.findOne(
            {
                where:
                {
                    nit,
                    proveedorId: { [Op.ne]: proveedorId,empresaId },
                    estadoId: { [Op.ne]: 3}
                },
                attributes: ['proveedorId']
            });

        if (existe) {
            response.code = -1;
            response.data = "El nuevo nit ya existe, por favor verifique";
            return response;
        }
    }

    const dataAnterior = await Modelo.findOne({
        where: { proveedorId,empresaId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                proveedorId,empresaId
            }
        });
        if (resultado > 0) {
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, proveedorId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    proveedorId
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
    let proveedorId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { proveedorId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                proveedorId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, proveedorId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    proveedorId
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