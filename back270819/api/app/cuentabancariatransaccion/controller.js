const moment = require('moment');
var { Op } = require('sequelize');
const { CuentaBancariaTransaccion, Estado } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const BancoTransaccion = require('../../../utils/funciones/BancoTransaccion');
const MenuId = 44;
const Modelo = CuentaBancariaTransaccion;
const tabla = 'cuenta_bancaria_transaccion';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId,empresaId } = req.user;
    let transaction;
    try {
        transaction = await Modelo.sequelize.transaction();
        let result=await BancoTransaccion.Registrar(transaction,req.body,usuarioId,empresaId);
        if (result.code === 1) {
            await transaction.commit();
        } else {
            await transaction.rollback();
        }
        response = result;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
    return response;
}

const consultar = async (query, include = 1) => {
    if (include == 1) {
        return await Modelo.findAll({
            include: [{
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion'],
            }
            ],
            where: [query],
            order: [
                ['serialId', 'ASC']
            ]
        });
    } else {
        return await Modelo.findAll({ where: query });
    }
}

const list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const { include } = req.query;
    let query = {};
    let { empresaId } = req.user;
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
            query.serialId = Number(id);
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

module.exports = {
    list,
    insert
}