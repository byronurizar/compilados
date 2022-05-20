const { Estado, CatCategoriaGrupoGasto, CatPresupuestoGrupoGasto, PresupuestoDetalleGrupoGasto, CatMes } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
var { Op } = require('sequelize');
const sequelize = require("sequelize");
const MenuId = 9;
const Modelo = CatPresupuestoGrupoGasto;
const tabla = 'cat_categoria_grupo_gasto';
const insert = async (req) => {
    let response = {};
    let transaction;
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }

    let { usuarioId, grupo_gastoId } = req.user;
    let { anio, mesId, descripcion, detalle = [] } = req.body;
    descripcion = String(descripcion).trim().toUpperCase();
    let datos = {
        anio,
        mesId,
        descripcion,
        grupo_gastoId,
        usuario_crea: usuarioId
    };

    if (detalle.length <= 0) {
        response.code = 0;
        response.data = `Debe de existir un detalle para el presupuesto`;
        return response;
    }

    let anioActual = 0;
    let mesActual = 0;

    anioActual = moment(new Date()).format('YYYY');
    mesActual = moment(new Date()).format('MM');

    if (Number(anio) < Number(anioActual) || (Number(mesId) < Number(mesActual) && Number(anio) < Number(anioActual)) || mesId>12) {
        response.code = 0;
        response.data = `La información de año y mes del presupuesto no es valida`;
        return response;
    }

    const existe = await Modelo.findOne({ where: { anio, mesId,grupo_gastoId, estadoId: { [Op.ne]: 3 } }, attributes: ['presupuestoId'] });
    if (existe) {
        response.code = 0;
        response.data = `Ya existe un presupuesto para este año y mes, por favor verifique`;
        return response;
    }
    let listDetalle = [];
    for (let { categoriaId, monto = 0 } of detalle) {
        if (Number(monto) <= 0) {
            response.code = 0;
            response.data = "En el detalle del presupuesto no debe de existir un monto menor o igual a 0";
            return response;
        }
        let existeCategoria = listDetalle.find(i => Number(i.categoriaId) === Number(categoriaId));
        if (existeCategoria) {
            response.code = 0;
            response.data = "No se permite que una misma categoria tenga dos items de presupuesto";
            return response;
        } else {
            listDetalle.push({
                categoriaId,
                monto
            });
        }
    }

    try {
        transaction = await Modelo.sequelize.transaction();
        datos.fecha_presupuesto=`${anio}/${mesId}/01`;
        const result = await Modelo.create(datos, { transaction });
        if (result) {
            let { presupuestoId } = result;
            for await (let { monto, categoriaId } of detalle) {
                let datosDetalle = {
                    presupuestoId,
                    monto,
                    categoriaId,
                    usuario_crea: usuarioId
                };
                await PresupuestoDetalleGrupoGasto.create(datosDetalle, { transaction });
            }
            await transaction.commit();
            response.code = 1;
            response.data = "Presupuesto registrado exitosamente";
        } else {
            await transaction.rollback();
            response.code = -1;
            response.data = "Ocurrió un error al intentar registrar la categoría";
        }
    } catch {

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
                    model: PresupuestoDetalleGrupoGasto,
                    as: "Detalle",
                    required: true,
                    include: [{
                        model: CatCategoriaGrupoGasto,
                        as: "Categoria",
                        required: true,
                        attributes: ['nombre'],
                    }
                    ]
                }, {
                    model: CatMes,
                    as: "Mes",
                    required: true,
                    attributes: ['descripcion'],
                }
                ],
                where: [query],
                order: [['anio', 'DESC'], ['mesId', 'DESC']]
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
                    model: PresupuestoDetalleGrupoGasto,
                    as: "Detalle",
                    required: true,
                    include: [{
                        model: CatCategoriaGrupoGasto,
                        as: "Categoria",
                        required: true,
                        attributes: ['nombre'],
                    }
                    ]
                },
                {
                    model: CatMes,
                    as: "Mes",
                    required: true,
                    attributes: ['descripcion'],
                }],
                order: [['anio', 'DESC'], ['mesId', 'DESC']]
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
    let { grupo_gastoId } = req.user;
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId } = req.query;
    let query = {};
    query.grupo_gastoId=grupo_gastoId;
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
            query.categoriaId = Number(id);
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
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 2);
    if (autorizado !== true) {
        return autorizado;
    }
    let { presupuestoId, anio, mesId, estadoId, descripcion, detalle = [] } = req.body;
    let { usuarioId,grupo_gastoId } = req.user;
    descripcion = String(descripcion).trim().toUpperCase();
    if (detalle.length <= 0) {
        response.code = 0;
        response.data = `Debe de existir un detalle para el presupuesto`;
        return response;
    }

    let anioActual = 0;
    let mesActual = 0;

    anioActual = moment(new Date()).format('YYYY');
    mesActual = moment(new Date()).format('MM');

    if (Number(anio) < Number(anioActual) || Number(mesId) < Number(mesActual)) {
        response.code = 0;
        response.data = `La información de año y mes del presupuesto no es valida`;
        return response;
    }


    const existe = await Modelo.findOne({
        where: {
            anio,
            mesId,
            grupo_gastoId,
            estadoId: { [Op.ne]: 3 },
            presupuestoId: {[Op.ne]: presupuestoId}
        },
        attributes: ['presupuestoId']
    });
    if (existe) {
        response.code = 0;
        response.data = `Ya existe un presupuesto para este año y mes, por favor verifique`;
        return response;
    }

    let listDetalle = [];
    for (let { presupuesto_detalleId = 0, categoriaId, monto = 0, estadoId: estadoIdDetalle = 1 } of detalle) {
        if (Number(monto) <= 0) {
            response.code = 0;
            response.data = "En el detalle del presupuesto no debe de existir un monto menor o igual a 0";
            return response;
        }
        let existeCategoria = listDetalle.find(i => Number(i.categoriaId) === Number(categoriaId));
        if (existeCategoria) {
            response.code = 0;
            response.data = "No se permite que una misma categoria tenga dos items de presupuesto";
            return response;
        } else {
            listDetalle.push({
                presupuesto_detalleId,
                categoriaId,
                monto,
                estadoIdDetalle
            });
        }
    }

    const dataAnterior = await Modelo.findOne({
        where: { presupuestoId, grupo_gastoId }
    });

    let newData = {
        descripcion,
        anio,
        mesId,
        estadoId
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(newData, {
            where: {
                presupuestoId, grupo_gastoId
            }
        });

        let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
        const data = {
            fecha_ult_mod,
            usuario_ult_mod: usuarioId
        }
        if (resultado > 0) {
            newData.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, presupuestoId, dataAnterior.dataValues, newData);

            //Actualizar fecha de ultima modificacion
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    presupuestoId
                }
            });
        }
        for await (let { presupuesto_detalleId, categoriaId, monto, estadoIdDetalle } of listDetalle) {
            let nuevoDatos = {
                categoriaId,
                monto
            };
            if (presupuesto_detalleId > 0) {
                const dataAnteriorDetalle = await PresupuestoDetalleGrupoGasto.findOne({
                    where: { presupuesto_detalleId, presupuestoId }
                });

                if (!dataAnteriorDetalle) {
                    response.code = 0;
                    response.data = "La información del detalle del presupuesto no es válida";
                    return response;
                }
                nuevoDatos.estadoId = estadoIdDetalle;
                const resultUpd = await PresupuestoDetalleGrupoGasto.update(nuevoDatos, {
                    where: {
                        presupuesto_detalleId, presupuestoId
                    }
                });
                if (resultUpd > 0) {
                    await registrarBitacora('presupuesto_detalle', presupuesto_detalleId, dataAnteriorDetalle.dataValues, nuevoDatos);
                    await PresupuestoDetalleGrupoGasto.update(data, {
                        where: {
                            presupuesto_detalleId, presupuestoId
                        }
                    });
                }
            } else {
                let datosDetalle = {
                    presupuestoId,
                    monto,
                    categoriaId,
                    usuario_crea: usuarioId
                };
                await PresupuestoDetalleGrupoGasto.create(datosDetalle);
            }
        }
        response.code = 1;
        response.data = "Información Actualizado exitosamente";
        return response;

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
    let { grupo_gastoId } = req.user;
    let response = {};
    let presupuestoId = req.params.id;
    const dataAnterior = await Modelo.findOne({
        where: { presupuestoId, grupo_gastoId }
    });

    const dataEliminar = {
        estadoId: 3
    };
    if (dataAnterior) {
        const resultado = await Modelo.update(dataEliminar, {
            where: {
                presupuestoId, grupo_gastoId
            }
        });
        if (resultado > 0) {
            let { usuarioId } = req.user;
            dataEliminar.usuario_ult_mod = usuarioId;
            await registrarBitacora(tabla, presupuestoId, dataAnterior.dataValues, dataEliminar);

            //Actualizar fecha de ultima modificacion
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Modelo.update(data, {
                where: {
                    presupuestoId,
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