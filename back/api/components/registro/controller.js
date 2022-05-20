const { Estado, CatCategoriaGrupoGasto, Persona, Usuario, CatGrupoGasto, GrupoGastoUsuario, Parametro, ConfirmarCuenta, UsuarioAccesoGrupoGasto, UsuarioRol } = require('../../../store/db');
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
    let response = {};
    let autorizado = await validarpermiso(req, MenuId, 1);
    if (autorizado !== true) {
        return autorizado;
    }
    let {
        nombre1,
        apellido1,
        generoId = 0,
        fecha_nacimiento,
        email,
        password,
        nombre_grupo,
        monedaId = 0
    } = body;
    console.log(req.body);
    nombre1 = String(nombre1).trim().toUpperCase();
    apellido1 = String(apellido1).trim().toUpperCase();
    email = String(email).trim().toLocaleLowerCase();
    nombre_grupo = String(nombre_grupo).trim().toUpperCase();

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
    if (monedaId <= 0) {
        if (existeMsg) {
            mensaje += ",moneda"
        } else {
            mensaje += "moneda"
            existeMsg = true;
        }
    }
    if (String(fecha_nacimiento).trim().length < 10) {
        if (existeMsg) {
            mensaje += ",fecha de nacimiento";
        } else {
            mensaje += "fecha de nacimiento";
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

    if (String(nombre_grupo).trim().length <= 3) {
        if (existeMsg) {
            mensaje += ",nombre del grupo";
        } else {
            mensaje += "nombre del grupo";
            existeMsg = true;
        }
    }
    if (String(password).trim().length <= 0) {
        if (existeMsg) {
            mensaje += ",password";
        } else {
            mensaje += "password";
            existeMsg = true;
        }
    }

    if (existeMsg) {
        let errorMessage = `Por favor validar la información ${mensaje}`;
        response.code = 0;
        response.data = errorMessage;
        return response;
    }

    let datosPersona = {
        nombre1,
        apellido1,
        fecha_nacimiento,
        email,
        generoId,
    };

    try {
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
                    estadoId: 4
                };
                let resultUser = await Usuario.create(datosUsuario, { transaction });
                let { usuarioId } = resultUser;
                if (Number(usuarioId) > 0) {
                    let datosRegGrupo = {
                        nombre: nombre_grupo,
                        usuario_crea: usuarioId,
                    };
                    let resulRegGrupo = await CatGrupoGasto.create(datosRegGrupo, { transaction });
                    let { grupo_gastoId } = resulRegGrupo;
                    if (Number(grupo_gastoId) > 0) {
                        let datosRegGrupoUsuario = {
                            grupo_gastoId,
                            monedaId,
                            usuarioId,
                            usuario_crea: usuarioId
                        }

                        await GrupoGastoUsuario.create(datosRegGrupoUsuario, { transaction });
                        await UsuarioRol.create({
                            usuarioId,
                            rolId:2,
                            usuario_crea: usuarioId
                        }, { transaction });
                        let listAccesosAdministrador=[
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:1,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:2,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:3,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:4,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:5,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:6,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:7,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:8,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:9,
                                estadoId:1,
                            },
                            {
                                usuarioId,
                                usuario_crea: usuarioId,
                                accesoId:10,
                                estadoId:1,
                            }
                        ];
                        await UsuarioAccesoGrupoGasto.bulkCreate(listAccesosAdministrador, { transaction });

                        let resultSendEmail = await enviarCorreo(req, usuarioId, email, transaction);
                        if (resultSendEmail.code === 1) {
                            await transaction.commit();
                            return resultSendEmail;
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
    const { valor: horasVigenciaEnlace } = parametros.find(item => item.nombreVariable === "horasVigenciaEnlace");
    const config = {};
    config.host = host;
    config.port = Number(port);
    config.secure = Boolean(secure);
    config.user = user;
    config.pass = pass;
    config.horasVigenciaEnlace = horasVigenciaEnlace;
    return config;
}

const getInfoCorreo = async () => {
    const parametros = await Parametro.findAll(
        {
            where: { 'nombreGrupo': 'CONFIG_EMPRESA', estadoId: [1] },
            attributes: ['tipoDato', 'nombreVariable', 'valor']
        });

        const parametros2 = await Parametro.findAll(
            {
                where: { 'nombreGrupo': 'CONFIG_EMPRESA', estadoId: [1] },
                attributes: ['tipoDato', 'nombreVariable', 'valor']
            });
    const { valor: nombreEmpresa } = parametros.find(item => item.nombreVariable === "nombreEmpresa");
    const { valor: direccionEmpresa } = parametros.find(item => item.nombreVariable === "direccionEmpresa");
    const { valor: urlLogoEmpresa } = parametros.find(item => item.nombreVariable === "urlLogoEmpresa");
    const { valor: urlConfirmacionCuenta } = parametros.find(item => item.nombreVariable === "urlConfirmacionCuenta");
    const { valor: horasVigenciaEnlace } = parametros.find(item => item.nombreVariable === "horasVigenciaEnlace");
    const config = {};
    config.nombreEmpresa = nombreEmpresa;
    config.direccionEmpresa = direccionEmpresa;
    config.urlLogoEmpresa = urlLogoEmpresa;
    config.urlConfirmacionCuenta = urlConfirmacionCuenta;
    config.horasVigenciaEnlace=horasVigenciaEnlace;
    return config;
}
const enviarCorreo = async (req, usuarioId, email, transaction) => {
    let response = {};
    let { htmlResetPassword: htmlConfirmCuenta } = require('../../../utils/plantillasCorreo/ResetPassword');

    let ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (usuarioId > 0) {
        let solicitudExistente = false;
        let infoConfirmarCuenta = await ConfirmarCuenta.findOne({
            where: { usuarioId, estadoId: [1] },
            attributes: ['codigo', 'messageId', 'fecha_vencimiento', 'estadoId'],
            order: [
                ['codigo', 'DESC']
            ],
            transaction
        });
        if (infoConfirmarCuenta) {
            const { fecha_vencimiento } = infoConfirmarCuenta;
            let minutosParaVencer = moment.duration(moment(fecha_vencimiento).diff(moment(new Date()))).asMinutes();
            if (minutosParaVencer > 0) {
                solicitudExistente = true;
            }
        }
        if (!solicitudExistente) {
            const configuracion = await Correo.getConfiguracionEmail();
            
            const infoCorreo = await getInfoCorreo();
            console.log({configuracion,infoCorreo});
            const { horasVigenciaEnlace = 2 } = !!infoCorreo && infoCorreo;
            const { nombreEmpresa = "NO CONFIGURADO", direccionEmpresa = "NO CONFIGURADO", urlLogoEmpresa = "#", urlConfirmacionCuenta = "#" } = !!infoCorreo && infoCorreo;
            let uuidReset = v4();
            const infoReset = {
                codigo: uuidReset,
                emisor: configuracion.user,
                receptor: email,
                ip_solicitud: ipCliente
            };
            infoReset.usuarioId = usuarioId;
            infoReset.fecha_vencimiento = moment(new Date(), 'YYYY/MM/DD HH:mm').add(horasVigenciaEnlace, "hours");
            console.log({ infoReset });
            const data = await ConfirmarCuenta.create(infoReset, { transaction });
            const { codigo } = !!data && data;


            htmlConfirmCuenta = htmlConfirmCuenta.replace("[urlLogoEmpresa]", urlLogoEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloCorreo]", "Confirmación de Cuenta");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[descripcionCorta]", "Toque el botón de abajo para confirmar su cuenta. Si no solicitó una confirmación de cuenta, puede eliminar este correo de forma segura.");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[contenidoCorreo]", "Toque el botón de abajo para confirmar su cuenta. Si no solicitó una confirmación de cuenta, puede eliminar este correo de forma segura.");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[tituloBoton]", "Confirmar");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[informacionExtra]", `El enlace para confirmar la cuenta vence en <b>${horasVigenciaEnlace}</b> horas.`);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[footer]", "Recibió este correo electrónico porque recibimos una solicitud de <b>Confirmación de Cuenta</b>. Si no solicitó <b>Crear una Cuenta</b>, puede eliminar este correo de forma segura.");
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[nombreEmpresa]", nombreEmpresa);
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[direccionEmpresa]", direccionEmpresa);
            let hrefBoton = `${urlConfirmacionCuenta}${codigo}`;
            htmlConfirmCuenta = htmlConfirmCuenta.replace("[hrefBoton]", hrefBoton);

            const resultEmail = await Correo.sendMailoAuth2(configuracion, email, "Confirmar Cuenta", null, htmlConfirmCuenta);
            if (resultEmail.code === 0) {
                let dataSendMail = resultEmail.data;
                let messageId = dataSendMail.messageId;
                messageId = messageId.replace("<", "").replace(">", "");
                const resultadoUpdateConfirmaCuenta = await ConfirmarCuenta.update({ messageId, estadoId: 1 }, {
                    where: {
                        codigo
                    },
                    transaction
                });
                response.code = 1;
                response.data = "Se ha enviado un enlace a su correo electrónico, por favor revise su bandeja de entrada y confirme su registro.";
            } else {
                response.code = 0;
                response.data = "No se logró enviar el correo, por favor intente nuevamente";
            }
        } else {
            response.code = 0;
            response.data = "Ya existe una solicitud para la confirmación de su cuenta por favor revise su correo electrónico.";
        }
    } else {
        response.code = -1;
        response.data = "La persona no tiene asignado un usuario.";
    }
    return response;
}
const confirmacionCuenta = async (req) => {

    let response = {};
    const { id } = req.body;
    let ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (id) {
        let uuidReset = String(id).trim();
        let infoConfirmarCuenta = await ConfirmarCuenta.findOne({
            where: { codigo: uuidReset },
            attributes: ['codigo', 'usuarioId', 'messageId', 'fecha_vencimiento', 'estadoId'],
            order: [
                ['codigo', 'DESC']
            ]
        });

        console.log(infoConfirmarCuenta);
        if (infoConfirmarCuenta) {
            const { fecha_vencimiento, estadoId, usuarioId } = infoConfirmarCuenta;
            if (estadoId === 1) {
                let minutosParaVencer = moment.duration(moment(fecha_vencimiento).diff(moment(new Date()))).asMinutes();
                if (minutosParaVencer > 0) {
                    const resultadoUpdateUser = await Usuario.update({ estadoId: 1 }, {
                        where: {
                            usuarioId
                        }
                    });
                    if (resultadoUpdateUser > 0) {
                        const resultUpdateConfirmCuenta = await ConfirmarCuenta.update({ ip_update: ipCliente, fecha_update: new Date(), estadoId: 5 }, {
                            where: {
                                codigo: uuidReset
                            }
                        });
                        response.code = 1;
                        response.data = "Cuenta confirmada exitosamente";
                    } else {
                        response.code = -1;
                        response.data = "Ocurrió un error al intentar confirmar la cuenta, por favor comuniquese con el administrador de la aplicación.";
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
            response.data = "No existe solicitud para confirmación de la cuenta";
        }
    } else {
        response.code = -1;
        response.data = "Los parametros enviados no son válidos.";
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
                    const resultadoUpdateConfirmaCuenta = await ConfirmarCuenta.update({ estadoId: 3 }, {
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