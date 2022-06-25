const moment = require('moment');
var sequelize = require("sequelize");
const { Categoria, TipoDocumento, Estado, TipoDTE, TipoPago } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const { Model } = require('sequelize');
let response = {};
const MenuId=47;

const list=async(req)=>{
    let resultado={};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let {catalogo}=req.params;
    switch (catalogo) {
        case 'tipo_dte':
            resultado.code=1;
            resultado.data=await TipoDTE.findAll({
                where:{estadoId:1},
                attributes:['tipo_dteId','descripcion']
            });
            return resultado;
            case 'tipo_pago':
                resultado.code=1;
                resultado.data=await TipoPago.findAll({
                    where:{estadoId:1},
                    attributes:['tipo_pagoId','nombre']
                });
                return resultado;
        default:
            resultado.code=-1;
            resultado.data="Catálogo no definido";
            return resultado;
            break;
    }
}


const insert = async (req) => {
    const { catalogo } = req.params;
    const [existe, Modelo, , MenuId] = getInfoCatalogo(catalogo);

    if (existe === true) {
        // let autorizado = await validarpermiso(req, MenuId, 1);
        // if (autorizado !== true) {
        //     return autorizado;
        // }

        let { usuarioId } = req.user;
        req.body.usuario_crea = usuarioId;
        const result = await Modelo.create(req.body);
        response.code = 1;
        response.data = result;
        return response;
    } else {
        response.code = -1;
        response.data = "El catálogo especificado no existe";
        return response;
    }
}

const consultar = async (Modelo, query, include = 1) => {
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
                order: sequelize.literal('fecha_crea ASC')
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: ['descripcion'],
                }],
                order: sequelize.literal('fecha_crea ASC')
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

const list2 = async (req) => {
    const { catalogo } = req.params;
    const [existe, Modelo, , MenuId,columnaId] = getInfoCatalogo(catalogo);

    if (existe === true) {
        // let autorizado = await validarpermiso(req, MenuId, 3);
        // if (autorizado !== true) {
        //     return autorizado;
        // }
        const { include } = req.query;
        if (!req.query.id && !req.query.estadoId) {
            response.code = 1;
            response.data = await consultar(Modelo, null, include);
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

        if (!id) {
            response.code = 1;
            response.data = await consultar(Modelo, query, include);
            return response;
        } else {
            if (Number(id) > 0) {
                query[columnaId] = Number(id);
                response.code = 1;
                response.data = await consultar(Modelo, query, include);
                return response;
            } else {
                response.code = -1;
                response.data = "Debe de especificar un codigo";
                return response;
            }
        }
    } else {
        response.code = -1;
        response.data = "No existe el catálogo especificado";
        return response;
    }
}

const update = async (req) => {
    const { catalogo, idEditar } = req.params;
    const [existe, Modelo, tabla, MenuId, columnaId] = getInfoCatalogo(catalogo);

    if (existe === true) {
        // let autorizado = await validarpermiso(req, MenuId, 2);
        // if (autorizado !== true) {
        //     return autorizado;
        // }
        const dataAnterior = await Modelo.findOne({
            where: sequelize.literal(`${columnaId}=${idEditar}`)
        });

        if (dataAnterior) {
            const resultado = await Modelo.update(req.body, {
                where: sequelize.literal(`${columnaId}=${idEditar}`)
            });
            if (resultado > 0) {
                let { usuarioId } = req.user;
                req.body.usuario_ult_mod = usuarioId;
                await registrarBitacora(req,tabla, idEditar, dataAnterior.dataValues, req.body);

                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                const data = {
                    fecha_ult_mod,
                    usuario_ult_mod: usuarioId
                }

                const resultadoUpdateFecha = await Modelo.update(data, {
                    where: sequelize.literal(`${columnaId}=${idEditar}`)
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
    } else {
        response.code = -1;
        response.data = "No existe información para actualizar con los parametros especificados";
        return response;
    }
};

const eliminar = async (req) => {
    const { catalogo, idEditar } = req.params;
    const [existe, Modelo, tabla, MenuId, columnaId] = getInfoCatalogo(catalogo);

    if (existe === true) {

        // let autorizado = await validarpermiso(req, MenuId, 4);
        // if (autorizado !== true) {
        //     return autorizado;
        // }

        let tipo_documentoId = req.params.id;
        const dataAnterior = await Modelo.findOne({
            where: sequelize.literal(`${columnaId}=${idEditar}`)
        });

        const dataEliminar = {
            estadoId: 3
        };
        if (dataAnterior) {
            const resultado = await Modelo.update(dataEliminar, {
                where: sequelize.literal(`${columnaId}=${idEditar}`)
            });
            if (resultado > 0) {
                let { usuarioId } = req.user;
                dataEliminar.usuario_ult_mod = usuarioId;
                await registrarBitacora(req,tabla, idEditar, dataAnterior.dataValues, dataEliminar);

                //Actualizar fecha de ultima modificacion
                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                const data = {
                    fecha_ult_mod,
                    usuario_ult_mod: usuarioId
                }
                const resultadoUpdateFecha = await Modelo.update(data, {
                    where: sequelize.literal(`${columnaId}=${idEditar}`)
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
    } else {
        response.code = -1;
        response.data = "No existe información para eliminar con los parametros especificados";
        return response;
    }
}

const getInfoCatalogo = (catalogo) => {
    switch (catalogo) {
        case "categoria":
            return [
                true,
                Categoria,
                "cat_categoria",
                "-1",
                "categoriaId"
            ];
        default:
            return [
                false
            ];
    }
}

module.exports = {
    list,
    update,
    insert,
    eliminar
}