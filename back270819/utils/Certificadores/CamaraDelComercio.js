const fetch = require('node-fetch');
const moment = require('moment');
const CamaraDelComercioSolicitarToken = async ({ username, password, grant_type, endpoint_get_token }) => {
    let response = {};
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('grant_type', grant_type);

        let options = {};
        options.method = 'POST';
        options.headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };
        options.body = formData;

        const responseApi = await fetch(endpoint_get_token, options);
        if (responseApi.status === 401) {
            response.code = -1;
            response.data = "Ocurrió un error al intentar generar la autorización con el Certificador CAMARA DEL COMERCIO";
            return response;
        } else {
            const result = await responseApi.json();
            let { error, access_token, userName } = result;
            if (error) {
                response.code = -1;
                response.data = "Ocurrió un error al intentar generar la autorización con el Certificador CAMARA DEL COMERCIO";
                return response;
            } else {
                if (String(access_token).trim().length > 0) {
                    response.code = 1;
                    response.data = result;
                    return response;
                } else {
                    response.code = -1;
                    response.data = "Ocurrió un error al intentar generar la autorización con el Certificador CAMARA DEL COMERCIO";
                    return response;
                }
            }
        }
    } catch {
        response.code = -1;
        response.data = "Ocurrió un error al intentar generar la autorización con el Certificador CAMARA DEL COMERCIO";
        return response;
    }
}
const CamaraDelComercioCertificar = async (datos) => {
    let { endPoint, request, token } = datos;
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(request);
    options.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const response = await fetch(endPoint, options);
    if (response.status === 401) {
        response.code = -1;
        response.data = "Camara del Comercio => Acceso denegado para realizar la certificación";
        return response;
    } else if (response.status === 500) {
        response.code = -1;
        response.data = "Camara del Comercio => Por favor comuniquese con el administrador, ya que la información enviada no es valida";
        return response;
    } else {
        let datosAutorizacion = {};
        const result = await response.json();
        let { Resultado, Errores, UUID, Serie, Numero, FechaHoraCertificacion } = result;
        if (Resultado === true) {
            datosAutorizacion.numero_autorizacion = UUID;
            datosAutorizacion.serie = Serie;
            datosAutorizacion.numeroDTE = Numero;
            datosAutorizacion.fecha_hora_certificacion = moment(FechaHoraCertificacion,'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss')
            datosAutorizacion.certificadorId = 1;
            response.code = 1;
            response.data = datosAutorizacion;
        } else {
            response.code = -2;
            response.data = Errores;
        }
        return response;
    }
}
const CamaraDelComercioConsultaNit = async (datos) => {
    let { endPoint, request, token } = datos;
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(request);
    options.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const response = await fetch(endPoint, options);
    if (response.status === 401) {
        response.code = -1;
        response.data = "Camara del Comercio => Acceso denegado para realizar la certificación";
        return response;
    } else if (response.status === 500) {
        response.code = -1;
        response.data = "Camara del Comercio => Por favor comuniquese con el administrador, ya que la información enviada no es valida";
        return response;
    } else {
        let datosPersona = {};
        const result = await response.json();
        let { Resultado, NitEmisor, NombreEmisor } = result;
        if (Resultado === true) {
            datosPersona.nit = NitEmisor;
            datosPersona.nombre = NombreEmisor;
            response.code = 1;
            response.data = datosPersona;
        } else {
            response.code = -2;
            response.data = "Camara del Comercio => No se logró obtener la información del nit ingresado";
        }
        return response;
    }
}
const CamaraDelComercioConsultaDTE = async (datos) => {
    let { endPoint, request, token } = datos;
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(request);
    options.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const response = await fetch(endPoint, options);
    if (response.status === 401) {
        response.code = -1;
        response.data = "Camara del Comercio => Acceso denegado para realizar la certificación";
        return response;
    } else if (response.status === 500) {
        response.code = -1;
        response.data = "Camara del Comercio => Por favor comuniquese con el administrador, ya que la información enviada no es valida";
        return response;
    } else {
        let datosDTE = {};
        const result = await response.json();
        let { Resultado, UUID, Serie, Numero, FechaHoraCertificacion } = result;
        if (Resultado === true) {
            datosDTE.numero_autorizacion = UUID;
            datosDTE.serie = Serie;
            datosDTE.numeroDTE = Numero;
            datosDTE.fechahoraCertificacion = FechaHoraCertificacion;
            response.code = 1;
            response.data = datosDTE;
        } else {
            response.code = -2;
            response.data = "Camara del Comercio => No se logró obtener la información del número de DTE ingresado";
        }
        return response;
    }
}
const CamaraDelComercioAnulaDTE = async (datos) => {
    let { endPoint, request, token } = datos;
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(request);
    options.headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    const response = await fetch(endPoint, options);
    if (response.status === 401) {
        response.code = -1;
        response.data = "Camara del Comercio => Acceso denegado para realizar la certificación";
        return response;
    } else if (response.status === 500) {
        response.code = -1;
        response.data = "Camara del Comercio => Por favor comuniquese con el administrador, ya que la información enviada no es valida";
        return response;
    } else {
        let datosDTE = {};
        const result = await response.json();
        let { Resultado, Errores } = result;
        if (Resultado === true) {
            response.code = 1;
            response.data = result;
            console.log(result)
            return response;
        } else {
            response.code = -2;
            response.data = Errores;
        }
        return response;
    }
}
module.exports = {
    CamaraDelComercioSolicitarToken,
    CamaraDelComercioCertificar,
    CamaraDelComercioConsultaNit,
    CamaraDelComercioConsultaDTE,
    CamaraDelComercioAnulaDTE
}

/*
{
    "Resultado": false,
    "UUID": null,
    "Serie": null,
    "Numero": null,
    "FechaHoraCertificacion": null,
    "Errores": [
        {
            "CodigoError": "2.2.1.1",
            "DescripcionError": "La diferencia entre la fecha de emisión y de certificación excede los cinco días."
        }
    ],
    "Alertas": [],
    "XmlDteCertificado": null
}
*/