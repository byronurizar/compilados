const moment = require('moment');
var sequelize = require("sequelize");
var { Op } = require('sequelize');
const { CuentaContable, PartidaContable, PartidaContableDetalle, Estado, TipoContraParte, ControlComprobanteDetalle, TipoComprobante, Proveedor, Persona, PeriodoContable,Usuario, CuentaBancaria } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const PartidaDiario = require('../../../utils/funciones/PartidaDiario');
const MenuId = 42;
const Modelo = PartidaContable;
const tabla = 'partida_contable';
let response = {};

const insert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let transaction;
    try {
        let { usuarioId, empresaId } = req.user;
        req.body.usuario_crea = usuarioId;
        const { detalle } = req.body;
        transaction = await Modelo.sequelize.transaction();

        let partida = {
            detalle,
            observaciones: req.body.observaciones,
            fecha: req.body.fecha
        }
        let result = await PartidaDiario.Registrar(transaction, partida, usuarioId, empresaId);
        if (result.code === 1) {
            await transaction.commit();
        } else {
            await transaction.rollback();
        }
        response = result;
        return result;
    } catch (error) {
        await transaction.rollback();
        throw new Error(error);
    }
}

const filtrarPartidas=async(req)=>{
    let alerta="";
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    let {fechaInicial=undefined,fechaFinal=undefined}=req.body;
    if(!fechaInicial || !fechaFinal){
        alerta="Favor de enviar fecha inicial y fecha final";
    }
    if(alerta){
        response.code=0;
        response.data=alerta;
        return response;
    }
    fechaFinal= moment(fechaFinal, 'YYYY-MM-DD').add(1,"days").format('YYYY-MM-DD');
    let data=await PartidaContable.findAll({
        include:[
            {
                model: Usuario,
                as: "Usuario",
                require: true,
                attributes: ['user_name']
            },{
                model: PeriodoContable,
                as: "Periodo",
                require: true,
                attributes: ['descripcion']
            },
            {
                model: PartidaContableDetalle,
                as: "Detalle",
                require: true,
                attributes: ['monto'],
                where:{monto:{[Op.gt]:0}}
            }
        ],
        attributes: ['partida_contableId','numero_partida','observaciones','fecha','fecha_crea'],
        where: sequelize.literal(`partida_contable.fecha_crea between '${fechaInicial}' and '${fechaFinal}' or partida_contable.fecha between '${fechaInicial}' and '${fechaFinal}'`),
    });
    response.code=1;
    response.data=data;
    return response;
}
const consultar = async (query, contraparte = 1) => {
    if (contraparte == 1) {
        return await Modelo.findAll({
            include: [{
                model: PeriodoContable,
                as: "Periodo",
                required: true,
                attributes: ['descripcion'],
            }, {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion'],
            },
            {
                model: PartidaContableDetalle,
                as: "Detalle",
                required: true,
                attributes: ['partida_contableId', 'cuenta_contableId', 'tipo_contraparteId', 'contraparteId', 'monto'],
                include: [
                    {
                        model: CuentaContable,
                        as: "Cuenta",
                        required: true,
                        attributes: ['codigo', 'nombre'],
                    },
                    {
                        model: TipoContraParte,
                        as: "ContraParte",
                        required: false,
                        attributes: ['descripcion', 'tabla_referencia', 'columnaId', 'nombre_clave_json']
                    }
                ]
            }
            ],
            attributes: ['partida_contableId', 'periodo_contableId', 'numero_partida', 'observaciones', 'usuario_crea', 'fecha_crea'],
            order: [
                ['partida_contableId', 'ASC']
            ]
        });

    } else {
        return await Modelo.findAll({
            include: [{
                model: PeriodoContable,
                as: "Periodo",
                required: true,
                attributes: ['descripcion'],
            }, {
                model: Estado,
                as: "Estado",
                required: true,
                attributes: ['descripcion'],
            },
            {
                model: PartidaContableDetalle,
                as: "Detalle",
                required: true,
                attributes: ['partida_contableId', 'cuenta_contableId', 'tipo_contraparteId', 'contraparteId', 'monto'],
                include: [
                    {
                        model: CuentaContable,
                        as: "Cuenta",
                        required: true,
                        attributes: ['codigo', 'nombre'],
                    }
                ]
            }
            ],
            attributes: ['partida_contableId', 'periodo_contableId', 'numero_partida', 'observaciones', 'usuario_crea', 'fecha_crea'],
            order: [
                ['partida_contableId', 'ASC']
            ]
        });
    }
}

const listarPartida = async (req) => {
    let { id } = req.params;
    if (Number(id) > 0) {
        response.code=1;
        response.data=await PartidaContableDetalle.findAll({
            where: { partida_contableId: id, estadoId: 1 },
            include:[
                {
                    model: CuentaContable,
                    as: "Cuenta",
                    required: true,
                    attributes: ['nombre','codigo'],
                }
            ],
            attributes: ['partida_contable_detalleId','partida_contableId','contraparteId','monto'],
            // order: [
            //     ['monto', 'ASC']
            // ]
        });
        return response;
    } else {
        response.code = -1;
        response.data = "Por favor ingrese el número de la partida";
        return response;
    }
}
const list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const { contraparte = 1 } = req.query;
    if (!req.query.id) {
        response.code = 1;
        let auxData = await consultar(null, contraparte);
        let listPartidas = [];
        if (contraparte == 1) {
            for await (let item of auxData) {
                let partida = item.dataValues;
                let detalleItem = partida.Detalle;
                delete partida["Detalle"];
                let listDetalle = [];
                for await (let detalle of detalleItem) {
                    let infoDetalle = detalle.dataValues;
                    if (infoDetalle.ContraParte !== null) {
                        let auxContraParte = infoDetalle.ContraParte.dataValues;
                        delete infoDetalle["ContraParte"];
                        let { tabla_referencia, nombre_clave_json } = auxContraParte;
                        if (tabla_referencia === "OTROS") {
                            let control_comprobanteId = infoDetalle.contraparteId;
                            let contraparteOtros = await ControlComprobanteDetalle.findAll(
                                {
                                    include: [{
                                        model: TipoComprobante,
                                        as: "Tipo",
                                        required: true,
                                        attributes: ['descripcion'],
                                    }],
                                    where: { control_comprobanteId }
                                }
                            );
                            auxContraParte[nombre_clave_json] = contraparteOtros;
                            infoDetalle.Contraparte = auxContraParte;
                            listDetalle.push(infoDetalle);
                        }

                        if (tabla_referencia === "PROVEEDORES") {
                            let proveedorId = infoDetalle.contraparteId;
                            let contraparteProveedor = await Proveedor.findOne(
                                {
                                    where: { proveedorId },
                                    attributes: ['proveedorId', 'nombre', 'descripcion']
                                }
                            );
                            auxContraParte[nombre_clave_json] = contraparteProveedor;
                            infoDetalle.Contraparte = auxContraParte;
                            listDetalle.push(infoDetalle);
                        }
                        if (tabla_referencia === "CLIENTE") {
                            let personaId = infoDetalle.contraparteId;
                            let contrapartePersona = await Persona.findOne(
                                {
                                    where: { personaId },
                                    attributes: ['personaId', 'nombre1', 'nombre2', 'nombre_otros', 'apellido1', 'apellido2', 'apellido_casada', 'fecha_nacimiento', 'email']
                                }
                            );
                            auxContraParte[nombre_clave_json] = contrapartePersona;
                            infoDetalle.Contraparte = auxContraParte;
                            listDetalle.push(infoDetalle);
                        }

                    } else {
                        listDetalle.push(infoDetalle);
                    }
                }
                partida.Detalle = listDetalle;
                listPartidas.push(partida);
            }
            response.data = listPartidas;
        } else {
            response.data = auxData;
        }
        return response;
    }

    const { id, estadoId, cargo_abono } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }

    if (cargo_abono) {
        query.cargo_abono = cargo_abono;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.grupo_contableId = Number(id);
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

const getCuentas=async(req)=>{
    let { empresaId } = req.user;
    let data = await CuentaBancaria.findAll({
        where: { empresaId,estadoId: 1 },
        attributes: [['cuenta_bancariaId','id'],[sequelize.literal("CONCAT(banco,' ',nombre_cuenta,' No.',numero_cuenta)"),'nombre']]
    });
    response.code=1;
    response.data=data;
    return response;
}
const getClientes = async () => {
    let data = await Persona.findAll({
        where: { estadoId: 1 },
        attributes: ['personaId', 'nombre1', 'nombre2', 'nombre_otros', 'apellido1', 'apellido2', 'apellido_casada']
    });
    let personas = [];
    personas = data.map(({ personaId, nombre1, nombre2, nombre_otros, apellido1, apellido2, apellido_casada }) => {
        let nombre = "";
        nombre += nombre1;
        if (nombre2) {
            nombre += ` ${nombre2}`
        }
        if (nombre_otros) {
            nombre += ` ${nombre_otros}`
        }
        nombre += ` ${apellido1}`;
        if (apellido2) {
            nombre += ` ${apellido2}`
        }
        if (apellido_casada) {
            nombre += ` ${apellido_casada}`
        }
        return {
            id: personaId,
            nombre
        }
    });
    response.code = 1;
    response.data = personas;
    return response;

}
const getProveedores = async () => {
    const data = await Proveedor.findAll({
        where: { estadoId: 1 },
        attributes: [['proveedorId', 'id'], 'nombre']
    })
    response.code = 1;
    response.data = data;
    return response;
}
const listarcontraparte = async (req) => {
    let { id } = req.params;

    if (Number(id) === 1) {
        return await getClientes();
    } else if (Number(id) === 2) {
        return await getProveedores();
    }else if (Number(id) === 3) {
        return await getCuentas(req);
    }
    else {
        response.code = -2;
        response.data = "El tipo de contraparte enviado no existe, por favor verifique";
        return response;
    }
}

module.exports = {
    list,
    insert,
    listarcontraparte,
    listarPartida,
    filtrarPartidas
}