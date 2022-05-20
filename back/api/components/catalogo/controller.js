var sequelize = require("sequelize");
const { Departamento, Estado, Pais, CatMes, CatMoneda, CatAccessoGrupoGasto, CatCategoriaGrupoGasto, SubCategoriaGrupoGasto, CatPerfilGrupoGasto, PerfilAccesoGrupoGasto } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 9;
const Modelo = Departamento;
const tabla = 'cat_departamento';



const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId } = req.user;
    req.body.usuario_crea = usuarioId;
    const result = await Modelo.create(req.body);
    response.code = 1;
    response.data = result;
    return response;
}

const list = async (req) => {
    let { catalogo } = req.params;
    let response = {};
    let grupo_gastoId = 1;
    let items = [];
    switch (catalogo) {
        case 'mes':
            items = await CatMes.findAll({
                where: { estadoId: 1 },
                attributes: ['mesId', "descripcion"]
            });
            break;
        case 'moneda':
            items = await CatMoneda.findAll({
                where: { estadoId: 1 },
                attributes: ['monedaId', "descripcion", "simbolo"]
            });
            break;
        case 'acceso':
            items = await CatAccessoGrupoGasto.findAll({
                where: { estadoId: 1 },
                attributes: ['accesoId', "descripcion"]
            });
            break;
        case 'perfil':
            items = await CatPerfilGrupoGasto.findAll({
                where: sequelize.literal(`estadoId=1 and (
                            grupo_gastoId is null or grupo_gastoId=${grupo_gastoId}
                        )`),
                attributes: ['perfilId', "nombre"]
            });
            break;
        case 'categoria':
            items = await CatCategoriaGrupoGasto.findAll({
                where: sequelize.literal(`estadoId=1 and (
                        grupo_gastoId is null or grupo_gastoId=${grupo_gastoId}
                    )`),
                attributes: ['categoriaId', "nombre"]
            });
            break;
        case 'subcategoria':
            let { id:idCategoria = 0 } = req.query;
            if (idCategoria <= 0) {
                response.code = -1;
                response.data = "Parametros enviados no válidos";
                return response;
            }
            items = await SubCategoriaGrupoGasto.findAll({
                where: { estadoId: 1, categoriaId: idCategoria },
                attributes: ['categoriaId', "nombre"]
            });
            break;

        default:
            response.code = -1;
            response.data = "Nombre de catálogo no válido";
            return response;
    }
    if (items.length > 0) {
        response.code = 1;
        response.data = items;
    } else {
        response.code = 1;
        response.data = "El catálogo se encuentra vacio";
    }
    return response;
}

const update = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    const { departamentoId } = req.body;
    const dataAnterior = await Modelo.findOne({
        where: { departamentoId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                departamentoId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, departamentoId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    departamentoId
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
    let departamentoId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { departamentoId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                departamentoId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, departamentoId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    departamentoId
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