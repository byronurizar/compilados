const { Estado, CatCategoriaGrupoGasto, Persona, Usuario, CatGrupoGasto, GrupoGastoUsuario, Parametro, InvitacionGrupoGasto } = require('../../../store/db');
const moment = require('moment');
const Correo = require('../../../utils/EnviarCorreo');
const { v4 } = require("uuid");
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
var { Op } = require('sequelize');
const bcrypt = require('bcrypt')
const MenuId = 9;
const Modelo = CatCategoriaGrupoGasto;
const tabla = 'cat_categoria_grupo_gasto';
const insert = async (req) => {
    let transaction;
    let { body } = req;
    let { usuarioId, grupo_gastoId } = req.user;
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let {
        nombre1,
        apellido1,
        generoId = 0,
        email
    } = body;

    nombre1 = String(nombre1).trim().toUpperCase();
    apellido1 = String(apellido1).trim().toUpperCase();
    email = String(email).trim().toLocaleLowerCase();

    let mensaje = "";
    let existeMsg = false;
    if (String(nombre1).trim().length <= 0) {
        mensaje = "nombre";
        existeMsg = true;
    }
    if (String(apellido1).trim().length <= 0) {
        if (existeMsg) {
            mensaje += ",apellido";
        } else {
            mensaje += "nombre";
            existeMsg = true;
        }
    }

    if (generoId <= 0) {
        if (existeMsg) {
            mensaje += ",genero"
        } else {
            mensaje += "genero"
            existeMsg = true;
        }
    }


    if (String(email).trim().length <= 0) {
        if (existeMsg) {
            mensaje += ",corre electrónico";
        } else {
            mensaje += "corre electrónico";
            existeMsg = true;
        }
    } else {
        let existe = await Persona.findOne({
            where: { email }
        });
        if (existe) {
            response.code = 0;
            response.data = `El correo ${email} ya se encuentra registrado`;
            return response;
        }
    }

    if (existeMsg) {
        let errorMessage = `Por favor validar la información ${mensaje}`;
        response.code = 0;
        response.data = errorMessage;
        return response;
    }

    let datosInvitacion = {
        nombre1,
        apellido1,
        receptor: email,
        usuarioId,
        generoId,
        grupo_gastoId
    };

    try {
        transaction = await Persona.sequelize.transaction();
        let resultSendEmail = await enviarCorreo(req, datosInvitacion, usuarioId, email, transaction);
        if (resultSendEmail.code === 1) {
            await transaction.commit();
            return resultSendEmail;
        } else {
            await transaction.rollback();
            return resultSendEmail;
        }

    } catch (err) {
        await transaction.rollback();
        response.code = -1;
        response.data = "Ocurrió un error al intentar enviar la invitación" + err;
        return response;
    }
}
const getConfiguracionEmail = async () => {
    const parametros = await Parametro.findAll(
        {
            where: { 'nombreGrupo': 'CONFIG_EMISOR', estadoId: [1] },
            attributes: ['tipoDato', 'nombreVariable', 'valor']
        });
    const { valor: host } = parametros.find(item => item.nombreVariable === "hostEmailEmisor");
    const { valor: port } = parametros.find(item => item.nombreVariable === "portHostEmisor");
    const { valor: secure } = parametros.find(item => item.nombreVariable === "secureHostEmisor");
    const { valor: user } = parametros.find(item => item.nombreVariable === "emailEmisor");
    const { valor: pass } = parametros.find(item => item.nombreVariable === "passwordEmisor");
    const { valor: horasVigenciaEnlaceInvitacion } = parametros.find(item => item.nombreVariable === "horasVigenciaEnlaceInvitacion");
    const config = {};
    config.host = host;
    config.port = Number(port);
    config.secure = Boolean(secure);
    config.user = user;
    config.pass = pass;
    config.horasVigenciaEnlaceInvitacion = horasVigenciaEnlaceInvitacion;
    return config;
}
const getInfoCorreo = async () => {
    const parametros = await Parametro.findAll(
        {
            where: { 'nombreGrupo': 'CONFIG_EMPRESA', estadoId: [1] },
            attributes: ['tipoDato', 'nombreVariable', 'valor']
        });
    const { valor: nombreEmpresa } = parametros.find(item => item.nombreVariable === "nombreEmpresa");
    const { valor: direccionEmpresa } = parametros.find(item => item.nombreVariable === "direccionEmpresa");
    const { valor: urlLogoEmpresa } = parametros.find(item => item.nombreVariable === "urlLogoEmpresa");
    const { valor: urlConfirmacionCuenta } = parametros.find(item => item.nombreVariable === "urlConfirmacionCuenta");
    const config = {};
    config.nombreEmpresa = nombreEmpresa;
    config.direccionEmpresa = direccionEmpresa;
    config.urlLogoEmpresa = urlLogoEmpresa;
    config.urlConfirmacionCuenta = urlConfirmacionCuenta;
    return config;
}
const enviarCorreo = async (req, dataInvitacion, usuarioId, email, transaction) => {
    let response = {};
    let { htmlResetPassword: htmlConfirmCuenta } = require('../../../utils/plantillasCorreo/ResetPassword');

    let ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (usuarioId > 0) {
        let datosUsuario = await Usuario.findOne({
            where: { usuarioId, estadoId: 1 }
        });
        let { personaId } = datosUsuario;
        if (!datosUsuario) {
            response.code = -1;
            response.data = "No existe información del usuario principal";
            return response;
        }

        let datosPersonsa = await Persona.findOne({
            where: { personaId, estadoId: 1 }
        });
        if (!datosPersonsa) {
            response.code = -1;
            response.data = "No existe información del usuario principal";
            return response;
        }

        let { nombre1, apellido1 } = datosPersonsa;
        let nombreCompleto = `${String(nombre1).trim().toUpperCase()} ${String(apellido1).trim().toUpperCase()}`;

        let existeInvitacion = false;
        let infoInvitacionGrupoGasto = await InvitacionGrupoGasto.findOne({
            where: { usuarioId, receptor: email, estadoId: [1] },
            attributes: ['codigo', 'messageId', 'fecha_vencimiento', 'estadoId'],
            order: [
                ['codigo', 'DESC']
            ],
            transaction
        });
        if (infoInvitacionGrupoGasto) {
            const { fecha_vencimiento } = infoInvitacionGrupoGasto;
            let minutosParaVencer = moment.duration(moment(fecha_vencimiento).diff(moment(new Date()))).asMinutes();
            if (minutosParaVencer > 0) {
                existeInvitacion = true;
            }
        }
        if (!existeInvitacion) {
            const configuracion = await getConfiguracionEmail();
            const infoCorreo = await getInfoCorreo();
            const { horasVigenciaEnlaceInvitacion = 2 } = !!configuracion && configuracion;
            const { nombreEmpresa = "NO CONFIGURADO", direccionEmpresa = "NO CONFIGURADO", urlLogoEmpresa = "#", urlConfirmacionCuenta = "#" } = !!infoCorreo && infoCorreo;
            let uuidReset = v4();
            const infoReset = {
                codigo: uuidReset,
                emisor: configuracion.user,
                receptor: email,
                ip_solicitud: ipCliente,
                ...dataInvitacion
            };
            infoReset.usuarioId = usuarioId;
            infoReset.fecha_vencimiento = moment(new Date(), 'YYYY/MM/DD HH:mm').add(horasVigenciaEnlaceInvitacion, "hours");
            const data = await InvitacionGrupoGasto.create(infoReset, { transaction });
            const { codigo } = !!data && data;


            htmlConfirmCuenta = htmlConfirmCuenta.replace("[urlLogoEmpresa]", urlLogoEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloCorreo]", `El Usuario ${nombreCompleto} lo ha invitado a su Grupo de Gasto`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[descripcionCorta]", "Toque el botón de abajo para confirmar su cuenta. Si no esta interesado en confirmar la cuenta, puede eliminar este correo de forma segura.");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[contenidoCorreo]", "Toque el botón de abajo para confirmar su cuenta. Si no esta interesado en confirmar la cuenta, puede eliminar este correo de forma segura.");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloBoton]", "Confirmar");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[informacionExtra]", `El enlace para confirmar la cuenta vence en <b>${horasVigenciaEnlaceInvitacion}</b> horas.`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[footer]", `Recibió este correo electrónico porque recibimos una solicitud de <b>Invitación a Grupo de Gasto</b>. Si no conoce al usuario <b>${nombreCompleto}</b>, puede eliminar este correo de forma segura.`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[nombreEmpresa]", nombreEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[direccionEmpresa]", direccionEmpresa);
            let hrefBoton = `${urlConfirmacionCuenta}${codigo}`;
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[hrefBoton]", hrefBoton);
            // const resultEmail = await Correo.sendMail(configuracion, email, "Confirmar Cuenta", null, htmlConfirmCuenta);
            let messageId = "asdfasfafd"//resultEmail.messageId;
            messageId = messageId.replace("<", "").replace(">", "");
            const resultadoUpdateConfirmaCuenta = await InvitacionGrupoGasto.update({ messageId, estadoId: 1 }, {
                where: {
                    codigo
                },
                transaction
            });
            response.code = 1;
            response.data = `Se ha enviado un enlace al correo electrónico ${dataInvitacion.receptor}, por favor notifíquele que revise su bandeja de entrada para proceder con la confirmación de la cuenta`;
        } else {
            response.code = 0;
            response.data = "Ya existe una invitación para este destinatario";
        }
    } else {
        response.code = -1;
        response.data = "El usuario principal no es valido";
    }
    return response;
}
const confirmacionCuenta = async (req) => {
    let response = {};
    let transaction;
    const { id, nombre1, nombre2, apellido1, apellido2, fecha_nacimiento,password } = req.body;
    let ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (id) {
        let uuidReset = String(id).trim();
        let infoInvitacionGrupoGasto = await InvitacionGrupoGasto.findOne({
            where: { codigo: uuidReset },
            attributes: ['codigo', 'usuarioId', 'messageId', 'fecha_vencimiento', 'estadoId','grupo_gastoId', 'receptor', 'generoId'],
            order: [
                ['codigo', 'DESC']
            ]
        });
        if (infoInvitacionGrupoGasto) {
            const { fecha_vencimiento, estadoId, usuarioId, receptor: email, generoId,grupo_gastoId } = infoInvitacionGrupoGasto;
            if (estadoId === 1) {
                let minutosParaVencer = moment.duration(moment(fecha_vencimiento).diff(moment(new Date()))).asMinutes();
                if (minutosParaVencer > 0) {
                    try {
                        nombre1 = String(nombre1).trim().toUpperCase();
                        apellido1 = String(apellido1).trim().toUpperCase();
                        email = String(email).trim().toLocaleLowerCase();
                        let datosPersona = {
                            nombre1,
                            apellido1,
                            fecha_nacimiento,
                            email,
                            generoId,
                        };
                        transaction = await Persona.sequelize.transaction();
                        const resultPerson = await Persona.create(datosPersona, { transaction });
                        if (resultPerson) {
                            let { personaId } = resultPerson;
                            if (Number(personaId) > 0) {
                                let datosUsuario = {
                                    personaId,
                                    user_name: email,
                                    forzar_cambio_password: 0,
                                    password: bcrypt.hashSync(password, 10),
                                    dias_cambio_password: 0,
                                    estadoId: 5
                                };
                                let resultUser = await Usuario.create(datosUsuario, { transaction });
                                let { usuarioId } = resultUser;
                                let datosRegGrupoUsuario = {
                                    grupo_gastoId,
                                    perfilId: 1,
                                    monedaId,
                                    usuarioId,
                                    usuario_crea: usuarioId
                                }
                                let resulResulGrupoUsuario = await GrupoGastoUsuario.create(datosRegGrupoUsuario, { transaction });
                                await EnviarCorreoUsuarioInvita();
                                await transaction.commit();
                            } else {
                                await transaction.rollback();
                                response.code = -1;
                                response.data = "Ocurrió un error al intentar realizar el registro";
                                return response;
                            }
                        } else {
                            await transaction.rollback();
                            response.code = -1;
                            response.data = "Ocurrió un error al intentar realizar el registro";
                            return response;
                        }
                    } catch (err) {
                        await transaction.rollback();
                        response.code = -1;
                        response.data = "Ocurrió un error al intentar realizar el registro" + err;
                        return response;
                    }
                } else {
                    response.code = -1;
                    response.data = "La solicitud para confirmar la cuenta ya venció.";
                }
            } else {
                response.code = -1;
                response.data = "La solicitud para la confirmación de la cuenta ya fue utilizada.";
            }
        } else {
            response.code = -1;
            response.data = "No existe solicitud para confirmación la invitación al grupo de gasto";
        }
    } else {
        response.code = -1;
        response.data = "Los parametros enviados no son válidos.";
    }

    return response;
}
const EnviarCorreoUsuarioInvita = async (usuarioId,emailInvitado) => {
    let response = {};
    let { htmlResetPassword: htmlConfirmCuenta } = require('../../../utils/plantillasCorreo/ResetPassword');

    if (usuarioId > 0) {
        let datosUsuario = await Usuario.findOne({
            where: { usuarioId, estadoId: 1 }
        });
        let { personaId } = datosUsuario;
        if (!datosUsuario) {
            response.code = -1;
            response.data = "No existe información del usuario principal";
            return response;
        }

        let datosPersonsa = await Persona.findOne({
            where: { personaId, estadoId: 1 }
        });
        if (!datosPersonsa) {
            response.code = -1;
            response.data = "No existe información del usuario principal";
            return response;
        }

        let { email} = datosPersonsa;

            const configuracion = await getConfiguracionEmail();
            const infoCorreo = await getInfoCorreo();
            const { nombreEmpresa = "NO CONFIGURADO", direccionEmpresa = "NO CONFIGURADO", urlLogoEmpresa = "#", urlConfirmacionCuenta = "#" } = !!infoCorreo && infoCorreo;

            htmlConfirmCuenta = htmlConfirmCuenta.replace("[urlLogoEmpresa]", urlLogoEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloCorreo]", `El Usuario ${emailInvitado} ha confirmado su invitación al grupo de gasto`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[descripcionCorta]", "");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[contenidoCorreo]", "");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloBoton]", "");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[informacionExtra]", ``);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[footer]", `Recibió este correo electrónico ya que el usuario ${emailInvitado} ha aceptado la invitación de unirse al grupo. Si no conoce al usuario <b>${emailInvitado}</b>, puede eliminar este correo de forma segura.`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[nombreEmpresa]", nombreEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[direccionEmpresa]", direccionEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[hrefBoton]",'');
            // const resultEmail = await Correo.sendMail(configuracion, email, "Confirmar Cuenta", null, htmlConfirmCuenta);
            let messageId = "asdfasfafd"//resultEmail.messageId;
            messageId = messageId.replace("<", "").replace(">", "");
            response.code = 1;
    } else {
        response.code = -1;
        response.data = "El usuario principal no es valido";
    }
    return response;
}
const nuevaConfirmacion = async (req) => {
    let response = {};
    let { body } = req;
    let { email } = body;
    if (String(email).trim().length > 0) {
        let infoUsuario = await Usuario.findOne({
            where: { user_name: email }
        });
        if (infoUsuario) {
            let { usuarioId, estadoId } = infoUsuario;
            if (Number(estadoId) === 4) {
                let transaction;
                try {
                    transaction = await Usuario.sequelize.transaction();
                    const resultadoUpdateConfirmaCuenta = await InvitacionGrupoGasto.update({ estadoId: 3 }, {
                        where: {
                            usuarioId
                        },
                        transaction
                    });
                    let resultSendEmail = await enviarCorreo(req, usuarioId, email, transaction);
                    if (resultSendEmail.code === 1) {
                        await transaction.commit();
                        return resultSendEmail;
                    } else {
                        await transaction.rollback();
                        response.code = -1;
                        response.data = "Ocurrió un error al intentar realizar la gestión";
                        return response;
                    }
                } catch (er) {
                    await transaction.rollback();
                    response.code = -1;
                    response.data = "Ocurrió un error al intentar realizar la gestión" + er;
                    return response;
                }
            } else {
                response.code = 0;
                response.data = "No existen cuentas para confirmar con los parametros proporcionados";
                return response;
            }
        } else {
            response.code = 0;
            response.data = "No existen cuentas para confirmar con los parametros proporcionados";
            return response;
        }
    } else {
        response.code = 0;
        response.data = "El correo electrónico enviado no es valido";
        return response;
    }
}
module.exports = {
    insert,
    confirmacionCuenta,
    nuevaConfirmacion
}