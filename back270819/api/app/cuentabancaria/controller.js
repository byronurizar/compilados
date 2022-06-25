const moment = require('moment');
var { Op } = require('sequelize');
const { CuentaBancaria, Estado, Municipio, Departamento } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 43;
const Modelo = CuentaBancaria;
const tabla = 'cat_cuenta_bancaria';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId, empresaId } = req.user;
    req.body.usuario_crea = usuarioId;
    req.body.empresaId = empresaId;
    let validarCuenta = await validarSiExisteCuentaPrincipal(empresaId, req.body);
    if (!validarCuenta) {
        response.code = -1;
        response.data = "Ocurrió un error al intentar validar la información de las cuentas, por favor intente nuevamente."
    }
    let { code } = validarCuenta;
    if (Number(code) === 1) {
        const result = await Modelo.create(req.body);
        response.code = 1;
        response.data = result;
    } else {
        response = validarCuenta;
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
                    ['cuenta_bancariaId', 'ASC']
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
    query.empresaId=empresaId;
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
            query.cuenta_bancariaId = Number(id);
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

const validarSiExisteCuentaPrincipal = async (empresaId, { cuenta_principal },cuenta_bancariaId=undefined) => {
    if (Boolean(cuenta_principal) !== true) {
        return {
            code: 1,
            data: ''
        }
    }
    let where={};
    where.empresaId=empresaId;
    where.cuenta_principal=cuenta_principal;
    where.estadoId=1;
    if(cuenta_bancariaId){
        where.cuenta_bancariaId={ [Op.ne]: cuenta_bancariaId};
    }
    let info =await Modelo.findOne({
        where,
        attributes: ['cuenta_bancariaId']
    });
    if (info) {
        return {
            code: -1,
            data: 'Actualmente ya existe una cuenta principal, por favor elimine la asignación de cuenta principal o actualize la existente'
        }
    } else {
        return {
            code: 1,
            data: ''
        }
    }

}
const update = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    const { id: cuenta_bancariaId } = req.params;

    const dataAnterior = await Modelo.findOne({
        where: { cuenta_bancariaId }
    });


    if (dataAnterior) {
        let { usuarioId,empresaId } = req.user;
        let validarCuenta = await validarSiExisteCuentaPrincipal(empresaId, req.body,cuenta_bancariaId);
        if (!validarCuenta) {
            response.code = -1;
            response.data = "Ocurrió un error al intentar validar la información de las cuentas, por favor intente nuevamente."
        }
        let { code } = validarCuenta;
        if (Number(code) !== 1) {
            return validarCuenta;
        }
        const resultado = await Modelo.update(req.body, {
            where: {
                cuenta_bancariaId,empresaId
            }
        });
        if (resultado > 0) {
            
            req.body.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, cuenta_bancariaId, dataAnterior.dataValues, req.body);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    cuenta_bancariaId
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
    let cuenta_bancariaId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { cuenta_bancariaId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        let { usuarioId,empresaId } = req.user;
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                cuenta_bancariaId,empresaId
            }
        });
        if (resultado > 0) {
          
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(req,tabla, cuenta_bancariaId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    cuenta_bancariaId
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