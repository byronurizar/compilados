const moment = require('moment');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var { Op } = require('sequelize');
const { Persona, Estado, Genero, DireccionPersona, IdentificacionPersona } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 12;
const Modelo = Persona;
const tabla = 'persona';
let response = {};

const upSert = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let { usuarioId, empresaId } = req.user;
    let
        {
            personaId: personaIdReq = 0,
            nit: nitReq = "CF",
            nombre1: nombre1Req = "",
            nombre2: nombre2Req = "",
            apellido1: apellido1Req = "",
            apellido2: apellido2Req = "",
            fecha_nacimiento: fecha_nacimientoReq = undefined,
            generoId: generoIdReq = 0,
            direccion_personaId: direccion_personaIdReq = 0,
            municipioId: municipioIdReq = 0,
            direccion: direccionReq = "",
            departamentoId: departamentoIdReq,
            email: emailRequ = ""
        } = req.body;

    let datosRegPersona = {
        empresaId,
        nombre1: nombre1Req,
        nombre2: nombre2Req,
        apellido1: apellido1Req,
        apellido2: apellido2Req,
        fecha_nacimiento: fecha_nacimientoReq ? fecha_nacimientoReq : undefined,
        email: String(emailRequ).trim().toLocaleLowerCase(),
        generoId: generoIdReq,
        usuario_crea: usuarioId
    }

    if (personaIdReq <= 0) {

        if (emailRequ) {
            if (String(emailRequ).trim().length > 0) {
                const persona = await Modelo.findOne({ where: { email: emailRequ, empresaId }, attributes: ['personaId'] });
                if (persona) {
                    response.code = 0;
                    response.data = "El correo electrónico enviado ya existe, por favor verifique";
                    return response;
                }
            }
        }


        let regPersona = await Persona.create(datosRegPersona);
        if (!regPersona) {
            response.code = -1;
            response.data = "No se logro registrar al cliente";
            return response;
        }
        let { personaId: personaIdNew } = regPersona;
        let datosRegDireccion = {
            personaId: personaIdNew,
            municipioId: municipioIdReq,
            direccion: direccionReq,
            puntoReferencia: '',
            usuario_crea: usuarioId
        }

        let itemRegDireccion = await DireccionPersona.create(datosRegDireccion)
        if (!itemRegDireccion) {
            response.code = -1;
            response.data = "No se logro registrar la dirección del cliente";
            return response;
        }
        let { direccion_personaId, municipioId, direccion } = itemRegDireccion;
        let datosIdentificacion = {
            personaId: personaIdNew,
            tipo_documentoId: 2,
            numero_identificacion: nitReq,
            usuario_crea: usuarioId
        };
        let itemRegIdentificacion = await IdentificacionPersona.create(datosIdentificacion);
        if (!itemRegIdentificacion) {
            response.code = -1;
            response.data = "No se logro registrar la información de identificación del cliente";
            return response;
        }

        let { numero_identificacion } = itemRegIdentificacion;
        let { personaId = 0, es_empleado = false, nombre1 = "", nombre2 = "", apellido1 = "", apellido2 = "", fecha_nacimiento, generoId, email = "" } = regPersona;
        let nombreCompleto = `${nombre1} ${nombre2 ? nombre2 : ""} ${apellido1 ? apellido1 : ""} ${apellido2 ? apellido2 : ""}`;
        nombreCompleto = String(nombreCompleto).trim().replace("  ", " ")
        let infoCliente = {
            personaId,
            es_empleado,
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            fecha_nacimiento: moment(fecha_nacimiento).format('YYYY-MM-DD'),
            generoId,
            email,
            nombreCompleto,
            nit: numero_identificacion,
            nuevo: false,
            direccion_personaId,
            departamentoId: departamentoIdReq,
            municipioId,
            direccion
        }

        response.code = 1;
        response.data = infoCliente;
        return response;
    } else {

        let datosUpdPersona = {
            empresaId,
            nombre1: nombre1Req,
            nombre2: nombre2Req,
            apellido1: apellido1Req,
            apellido2: apellido2Req,
            fecha_nacimiento: fecha_nacimientoReq ? fecha_nacimientoReq : undefined,
            email: String(emailRequ).trim().toLocaleLowerCase(),
            generoId: generoIdReq,
        }

        let updatePerson = await Persona.update(datosUpdPersona, {
            where: {
                personaId: personaIdReq
            }
        });

        if (updatePerson > 0) {
            let dataAnterior = await Persona.findOne({
                where: { personaId: personaIdReq }
            });
            datosUpdPersona.usuario_ult_mod = usuarioId;
            await registrarBitacora(req, 'persona', personaIdReq, dataAnterior.dataValues, datosUpdPersona);
            let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
            const data = {
                fecha_ult_mod,
                usuario_ult_mod: usuarioId
            }
            const resultadoUpdateFecha = await Persona.update(data, {
                where: {
                    personaId: personaIdReq
                }
            });
        }
        if (!direccion_personaIdReq) {
            let datosRegDireccion = {
                personaId: personaIdReq,
                municipioId: municipioIdReq,
                direccion: direccionReq,
                puntoReferencia: '',
                usuario_crea: usuarioId
            }
            let itemRegDireccion = await DireccionPersona.create(datosRegDireccion)
            if (!itemRegDireccion) {
                response.code = -1;
                response.data = "Cliente existente => No se logro registrar la dirección del cliente";
                return response;
            }
        } else {
            let datosUpdDireccion = {
                municipioId: municipioIdReq,
                direccion: direccionReq,
            }
            const resultado = await DireccionPersona.update(datosUpdDireccion, {
                where: {
                    personaId: personaIdReq,
                    direccion_personaId: direccion_personaIdReq
                }
            });

            if (resultado > 0) {
                let dataAnterior = await DireccionPersona.findOne({
                    where: { direccion_personaId: direccion_personaIdReq }
                });
                datosUpdDireccion.usuario_ult_mod = usuarioId;
                await registrarBitacora(req, 'direccion_persona', direccion_personaIdReq, dataAnterior.dataValues, datosUpdDireccion);
                let fecha_ult_mod = moment(new Date()).format('YYYY/MM/DD HH:mm');
                const data = {
                    fecha_ult_mod,
                    usuario_ult_mod: usuarioId
                }
                const resultadoUpdateFecha = await DireccionPersona.update(data, {
                    where: {
                        direccion_personaId: direccion_personaIdReq
                    }
                });
            }
        }
        
        response.code = 1;
        response.data = "Información de cliente actualizada, exitosamente";
        return response;
    }
}
module.exports = {
    upSert
}