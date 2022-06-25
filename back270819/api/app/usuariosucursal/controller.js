const { QueryTypes } = require('sequelize');
const moment = require('moment');
var { Op } = require('sequelize');
const { UsuarioSucursal, Estado, Usuario, Sucursal, bd } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 37;
const Modelo = UsuarioSucursal;
const tabla = 'usuario_sucursal';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    const { sucursalId, usuarioId } = req.body;
    const existe = await Modelo.findOne({ where: { sucursalId, usuarioId, estadoId: { [Op.ne]: 3 } }, attributes: ['usuario_sucursalId'] });

    if (existe) {
        response.code = -1;
        response.data = "El usuario ya tiene la sucursal, por favor verifique";
        return response;
    } else {
        let { usuarioId: usuarioIdReq } = req.user;
        req.body.usuario_crea = usuarioIdReq;
        const result = await Modelo.create(req.body);
        response.code = 1;
        response.data = result;
    }
    return response;
}

const consultar = async (query) => {
    if (query) {
        return await Modelo.findAll({
            include: [{
                model: Sucursal,
                as: "Sucursal",
                required: true,
                attributes: {
                    exclude: ["fecha_crea", "usuario_ult_mod", "fecha_ult_mod"],
                }
            },
            {
                model: Usuario,
                as: "Usuario",
                required: true,
                attributes: {
                    exclude: ["password", "forzar_cambio_password", "fecha_cambio_password", "dias_cambio_password", "intentos_fallidos"],
                }
            },
            {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion']
            }],
            where: [query],
            order: [
                ['usuario_sucursalId', 'ASC']
            ]
        });
    } else {
        return await Modelo.findAll({
            include: [{
                model: Sucursal,
                as: "Sucursal",
                required: true,
                attributes: {
                    exclude: ["fecha_crea", "usuario_ult_mod", "fecha_ult_mod"],
                }
            },
            {
                model: Usuario,
                as: "Usuario",
                required: true,
                attributes: {
                    exclude: ["password", "forzar_cambio_password", "fecha_cambio_password", "dias_cambio_password", "intentos_fallidos"],
                }
            },
            {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion']
            }],
            order: [
                ['usuario_sucursalId', 'ASC']
            ]
        });
    }
}

list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }

    if (!req.query.id && !req.query.estadoId && !req.query.usuarioId && !req.query.sucursalId) {
        response.code = 1;
        response.data = await consultar();
        return response;
    }

    const { id, estadoId, usuarioId, sucursalId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

    if (usuarioId) {
        query.usuarioId = usuarioId;
    }

    if (sucursalId) {
        query.sucursalId = sucursalId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query);
        return response;
    } else {
        if (Number(id) > 0) {
            query.usuario_sucursalId = Number(id);
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
    let usuario_sucursalId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { usuario_sucursalId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                usuario_sucursalId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req, tabla, usuario_sucursalId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    usuario_sucursalId
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
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let usuario_sucursalId = req.params.id;
    let { sucursalId } = req.body;
    if (sucursalId) {
        const existe = await Modelo.findOne(
            {
                where:
                {
                    sucursalId,
                    usuario_sucursalId: { [Op.ne]: usuario_sucursalId },
                    estadoId: { [Op.ne]: 3 }
                },
                attributes: ['usuario_sucursalId']
            });

        if (existe) {
            let { nombre } = existe;
            response.code = -1;
            response.data = "El usuario ya tiene asignada la sucursal " + nombre;
            return response;
        }
    }

    const dataAnterior = await Modelo.findOne({
        where: { usuario_sucursalId }
    });


    if (dataAnterior) {
        const resultado = await Modelo.update(req.body, {
            where: {
                usuario_sucursalId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req, tabla, usuario_sucursalId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    usuario_sucursalId
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
const listSucuralesActivas = async (req) => {
    let { usuarioId, empresaId } = req.user;
    let response = {};
    const listSucurales = await bd.query(`
    select 
        a.usuarioId
        ,b.sucursalId
        ,c.nombre from usuario a
    inner join usuario_sucursal b
    on a.usuarioId=b.usuarioId and a.estadoId=1 and b.estadoId=1
    inner join cat_sucursal c
    on b.sucursalId=c.sucursalId and c.estadoId=1
    where a.usuarioId=${usuarioId};`, {
        type: QueryTypes.SELECT
    });
    response.code = 1;
    response.data = listSucurales;
    return response;
}
module.exports = {
    list,
    insert,
    update,
    eliminar,
    listSucuralesActivas
}