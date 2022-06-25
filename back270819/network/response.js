const config = require("../config");
const { BitacoraPeticion } = require("../store/db");

exports.success = (req, res, message, status) => {
    if (config.api.bitacoraPeticion === true) {
        let { usuarioId = null,empresaId=null } = !!req.user && req.user;
        var ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const data = {
            baseUrl: req.baseUrl || req.originalUrl,
            method: req.method || "",
            request: {
                body: req.body || "",
                params: req.params || "",
                query: req.query || ""
            },
            response: message || "",
            status,
            error: false,
            usuario_crea: usuarioId,
            empresaId,
            ip_origen: ipCliente
        }
        registrarPeticion(data).then(() => {
            //console.log("Bitacora registrada exisotsamente");
        })
        .catch(erro => {
        //    console.log("Error al registrar la peticion", erro);
         });
    }
    let statusCode = status || 200;
    res.status(statusCode).send({
        error: false,
        status: status,
        body: message
    });
}

exports.error = (req, res, message, status) => {
    if (config.api.bitacoraError === true) {
        let { usuarioId = null,empresaId } = !!req.user && req.user;
        var ipCliente = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const data = {
            baseUrl: req.baseUrl || req.originalUrl,
            method: req.method || "",
            request: {
                body: req.body || "",
                params: req.params || "",
                query: req.query || ""
            },
            response: message || "",
            status,
            error: true,
            usuario_crea: usuarioId,
            empresaId,
            ip_origen: ipCliente
        }
        registrarPeticion(data).then(() => {
           // console.log("Bitacora registrada exisotsamente");
        })
        .catch(erro => {
            // console.log("Error al registrar la peticion", erro);
        });
    }
    let statusCode = status || 500;
    if(String(message).indexOf("CONSTRAINT")){
        message="La información enviada no es valida";
    }
    res.status(statusCode).send({
        error: true,
        status: status,
        body: message
    });
}

const registrarPeticion = async (data) => {
    await BitacoraPeticion.create(data);
}