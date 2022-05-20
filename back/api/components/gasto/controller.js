const { Estado, CatCategoriaGrupoGasto, GastoGrupoGasto, SubCategoriaGrupoGasto, bd } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
var { Op } = require('sequelize');
const MenuId = 9;
const { QueryTypes } = require('sequelize');
const Modelo = GastoGrupoGasto;
const tabla = 'gasto';
const insert = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId, grupo_gastoId } = req.user;
    let { categoriaId,
        sub_categoriaId = 0,
        descripcion = "",
        monto = 0, } = req.body;
    descripcion = String(descripcion).trim().toUpperCase();

    if (monto <= 0) {
        response.code = 0;
        response.data = `El monto del gasto debe ser mayor a 0`;
        return response;
    }
   
    let datos = {
        grupo_gastoId,
        categoriaId,
        descripcion,
        monto,
        usuario_crea: usuarioId
    };
    if(Number(sub_categoriaId)>0){
datos.sub_categoriaId=sub_categoriaId;
    }

    const result = await Modelo.create(datos);
    if (result) {
        response.code = 1;
        response.data = "Gasto registrado exitosamente";
    } else {
        response.code = 1;
        response.data = "Ocurrió un error al intentar registrar el gasto";
    }
    return response;
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
                    model: CatCategoriaGrupoGasto,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre'],
                },
                {
                    model: SubCategoriaGrupoGasto,
                    as: "SubCategoria",
                    required: false,
                    attributes: ['nombre'],
                }],
                where: [query],
                order: [
                    ['gastoId', 'ASC']
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
                    model: CatCategoriaGrupoGasto,
                    as: "Categoria",
                    required: true,
                    attributes: ['nombre'],
                },
                {
                    model: SubCategoriaGrupoGasto,
                    as: "SubCategoria",
                    required: false,
                    attributes: ['nombre'],
                }],
                order: [
                    ['gastoId', 'ASC']
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
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let existeFecha = false;
    let queryGasto = "";
    let queryPresupuesto = "";
    let { usuarioId, grupo_gastoId } = req.user;
    let { fechaInicial, fechaFinal } = req.body;
    if (String(fechaInicial).trim().length == 10 && String(fechaFinal).trim().length == 10) {
        existeFecha = true;
        let auxFechaInicialPresupuesto=String(fechaInicial).substring(0,8);
        auxFechaInicialPresupuesto=`${auxFechaInicialPresupuesto}01`;
        fechaFinal = moment(fechaFinal, 'YYYY-MM-DD').add(1, "days").format('YYYY-MM-DD');
        queryGasto += `and gas.fecha_crea between '${fechaInicial}' and '${fechaFinal}'`;
        queryPresupuesto += `and presu.fecha_presupuesto between '${auxFechaInicialPresupuesto}' and '${fechaFinal}'`;
    }
    response.code = 1;
    let resultAux = {};
    resultAux.gastos = await bd.query(`select 
     gas.gastoId,
     gas.categoriaId,
     cat.nombre as categoria,
     ifnull(gas.sub_categoriaId,0) sub_categoriaId,
     ifnull(sub.nombre,'') subcategora,
     gas.monto,
     ifnull(gas.descripcion,'') descripcion,
     gas.fecha_crea from gasto gas
        inner join cat_categoria_grupo_gasto cat
        on gas.categoriaId=cat.categoriaId
        left join cat_sub_categoria_grupo_gasto sub
        on gas.sub_categoriaId=sub.sub_categoriaId and sub.estadoId=1
        where gas.estadoId=1 and cat.estadoId=1 and gas.grupo_gastoId=${grupo_gastoId} ${queryGasto};`, {
        type: QueryTypes.SELECT
    });
    resultAux.presupuesto = await bd.query(`select presu.presupuestoId,
     presu.anio,
     presu.mesId,
     dlle.categoriaId,
     dlle.monto from cat_presupuesto presu
     inner join presupuesto_detalle dlle
     on presu.presupuestoId=dlle.presupuestoId
     where presu.estadoId=1 and dlle.estadoId=1 and presu.grupo_gastoId=${grupo_gastoId} ${queryPresupuesto};`, {
        type: QueryTypes.SELECT
    });
    response.data = resultAux;
    return response;
}



const update = async (req) => {
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId, grupo_gastoId } = req.user;
    let {
        gastoId,
        categoriaId,
        sub_categoriaId = undefined,
        descripcion = "",
        monto = 0, } = req.body;
    descripcion = String(descripcion).trim().toUpperCase();

    let newData = {
        grupo_gastoId,
        categoriaId,
        descripcion,
        monto
    };
    if (Number(sub_categoriaId) == 0) {
        newData.sub_categoriaId = null;
    }

    const dataAnterior = await Modelo.findOne({
        where: { gastoId, grupo_gastoId }
    });

    if (dataAnterior) {
        const resultado = await Modelo.update(newData, {
            where: {
                gastoId, grupo_gastoId
            }
        });
        if (resultado > 0) {

            newData.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, gastoId, dataAnterior.dataValues, newData);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    gastoId, grupo_gastoId
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
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let response = {};
    let gastoId = req.params.id;
    let { usuarioId, grupo_gastoId } = req.user;
    const dataAnterior = await Modelo.findOne({
        where: { gastoId, grupo_gastoId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                gastoId, grupo_gastoId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, gastoId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    gastoId,
                    grupo_gastoId
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