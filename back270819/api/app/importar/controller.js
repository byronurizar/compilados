const fs = require("fs");
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var sequelize = require("sequelize");
const { Persona, IdentificacionPersona, DireccionPersona, TelefonoPersona, DatoExtraPersona } = require("../../../store/db");

const ExportarPlantilla = (req, res) => {
    let { tipo } = req.params;
    switch (tipo) {
        case 'persona':
            const archivo = './importar/plantillaPersonas.xlsx';
            const fs = require("fs");
            let dataSalida = fs.readFileSync(archivo);
            let plantillaPersona = auxResponse(dataSalida, false);
            return res.json(plantillaPersona);
            break;
        default:
            let result = auxResponse(null, "Tipo de plantilla no difina");
            return res.json(result);
    }
}
const Importar = (req, res) => {
    let { file } = req;
    let { tipo } = req.params;
    if (!file) {
        let result = auxResponse(null, "No se adjunto ningún archivo, por favor verfique");
        return res.json(result);
    }
    if (file.originalname.split('.')[file.originalname.split('.').length - 1] === 'xlsx') {
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }

    try {
        exceltojson({
            input: req.file.path,
            output: null, //since we don't need output.json
            lowerCaseHeaders: false
        }, function (err, dataExcel) {
            if (err) {
                let responseAux = auxResponse(null, err);
                return res.json(responseAux);
            }
            switch (tipo) {
                case 'persona':
                    importarPersona(req, dataExcel).then((response) => {
                        let salidaPersona = auxResponse(response, null);
                        return res.json(salidaPersona);
                    }).catch(error => {
                        let salidaPersona = auxResponse(null, error);
                        return res.json(salidaPersona);
                    });
                    break;
                case 'plantilla':

                default:
                    let result = auxResponse(null, "Tipo de importación no válida");
                    return res.json(result);
            }
        });
    } catch (e) {
        throw new Error(e);
    }
}
const importarPersona = async (req, data) => {
    let { usuarioId, empresaId } = req.user;

    const validacionesPersona = async ({ email }) => {
        const persona = await Persona.findOne({ where: { email, empresaId }, attributes: ['personaId'] });
        if (persona) {
            return "El correo electrónico enviado ya existe, por favor verifique";
        } else {
            false;
        }
    }

    const validarDocumento = async ({ numero_identificacion }) => {
        let query = "";
        query = `identificacion_persona.estadoId!=3 and identificacion_persona.numero_identificacion=${numero_identificacion} and identificacion_persona.personaId in(select personaId from persona where persona.empresaId=${empresaId})`
        const existe = await IdentificacionPersona.findOne({ where: sequelize.literal(query), attributes: ['identificacion_personaId'] });
        if (existe) {
            return 'El número de identificación ya existe por favor verifique'
        } else {
            return false;
        }
    }

    const validarTelefono = async ({ telefono }) => {
        let query = "";
        query = `telefono_persona.estadoId!=3 and telefono_persona.telefono=${telefono} and telefono_persona.personaId in(select personaId from persona where persona.empresaId=${empresaId})`
        const existe = await TelefonoPersona.findOne({ where: sequelize.literal(query), attributes: ['telefono_personaId'] });
        if (existe) {
            return 'El número de teléfono ya existe'
        } else {
            return false;
        }
    }

    let encabezado = ['Nombre', 'Registro', 'Identificacion', 'Telefono', 'Direccion', 'Adicional'];

    let dataInsertada = [];
    for await (let persona of data) {
        let { nombre1 } = persona;
        persona.usuario_crea = usuarioId;
        persona.empresaId = empresaId;
        let validaciones = await validacionesPersona(persona);
        let itemSalida = {};
        if (nombre1) {
            let nombreCompleto = "";
            nombreCompleto += `${persona.nombre1} ${persona.nombre2} ${persona.apellido1} ${persona.apellido2}`;
            itemSalida.Nombre = nombreCompleto;
            itemSalida.Registro = 0;
            itemSalida.Identificacion = 0;
            itemSalida.Telefono = 0;
            itemSalida.Direccion = 0;
            itemSalida.Adicional = 0;
            if (!validaciones) {
                try {
                    let infoPersona = await Persona.create(persona);
                    itemSalida.Registro = true;
                    let { personaId } = infoPersona;
                    let { tipo_documentoId = undefined, numero_identificacion = undefined } = persona;
                    if (tipo_documentoId) {
                        let valIdentificacion = await validarDocumento(persona);
                        if (!valIdentificacion) {
                            try {
                                await IdentificacionPersona.create({
                                    personaId,
                                    tipo_documentoId,
                                    numero_identificacion,
                                    usuario_crea: usuarioId
                                });
                                itemSalida.Identificacion = true;
                            } catch (errIdentificacion) {
                                itemSalida.Identificacion = errIdentificacion.message;
                            }
                        } else {
                            itemSalida.Identificacion = valIdentificacion;
                        }
                    }
                    let { municipioId = undefined, direccion = undefined, punto_referencia = undefined } = persona;
                    if (municipioId) {
                        try {
                            await DireccionPersona.create({
                                personaId,
                                municipioId,
                                direccion,
                                punto_referencia,
                                usuario_crea: usuarioId
                            });
                            itemSalida.Direccion = true;
                        } catch (errDireccion) {
                            itemSalida.Direccion = errDireccion.message;
                        }
                    }
                    let { tipo_telefonoId = undefined, telefono = undefined } = persona;
                    if (tipo_telefonoId) {
                        try {
                            let valTelefono = await validarTelefono(persona);
                            if (!valTelefono) {
                                await TelefonoPersona.create({
                                    personaId,
                                    tipo_telefonoId,
                                    telefono,
                                    usuario_crea: usuarioId
                                });
                                itemSalida.Telefono = true;
                            } else {
                                itemSalida.Telefono = valTelefono;
                            }
                        } catch (errTelefono) {
                            itemSalida.Telefono = errTelefono.message;
                        }
                    }

                    let { tipo_sangreId = undefined, estado_civilId = undefined } = persona;
                    if (tipo_sangreId && estado_civilId) {
                        try {
                            await DatoExtraPersona.create({
                                personaId,
                                tipo_sangreId,
                                estado_civilId,
                                usuario_crea: usuarioId
                            });
                            itemSalida.Adicional = true;
                        } catch (errorDataExtra) {
                            itemSalida.Adicional = errorDataExtra.message;
                        }
                    }
                    dataInsertada.push(itemSalida);
                } catch (error) {
                    let mensajeError = error.message;
                    itemSalida.Registro = mensajeError;
                    dataInsertada.push(itemSalida);
                }
            } else {
                itemSalida.Registro = validaciones;
                dataInsertada.push(itemSalida);
            }
        }
    }
    return {
        header: encabezado,
        items: dataInsertada
    };
}

const auxResponse = (data, error) => {
    let response = {};
    response.error = false;
    response.status = 200;
    let body = {};
    body.code = error ? -1 : 1;
    body.data = error ? error : data;
    response.body = body;
    return response;
}

module.exports = {
    Importar,
    ExportarPlantilla
}