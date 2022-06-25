const { QueryTypes } = require('sequelize');
const moment = require('moment');
const { CamaraDelComercioSolicitarToken, CamaraDelComercioCertificar, CamaraDelComercioConsultaNit, CamaraDelComercioConsultaDTE, CamaraDelComercioAnulaDTE } = require('../Certificadores/CamaraDelComercio');
const { v4 } = require("uuid");
const fetch = require('node-fetch');
const { Certificador, Empresa, bd } = require('../../store/db');
const { GetXMLDTE, GetXMLAnulaDTE } = require('./ModelosXml');
const config = require('../../config');


const GetDatosEmpresa = async (empresaId) => {
    let datosEmpresa = {};
    let response = {};
    let itemEmpresa = await Empresa.findOne({
        where: { empresaId, estadoId: 1 },
        attributes: {
            exclude: ['giro_comercial', 'logo', 'usuario_crea', 'fecha_crea', 'usuario_ult_mod', 'fecha_ult_mod', 'estadoId'],
        }
    });
    if (!itemEmpresa) {
        response.code = -1;
        response.data = "No existe información de la empresa";
        return response;
    } else {

        let {
            certificadorId = 0,
            razon_social = "",
            nombre_comercial = "",
            nit = "",
            email = "",
            afiliacion_iva = "",
            codigo_moneda = "",
            codigo_escenario = 0,
            codigo_frase = 0,
            codigo_establecimiento = 0,
            codigo_pais = "",
            departamento = "",
            municipio = "",
            direccion = "",
            codigo_postal = "",
            nota_pie_factura=""
        } = itemEmpresa;
        if (String(razon_social).trim().length <= 0 || String(nombre_comercial).trim().length <= 0 || String(nit).trim().length <= 0 ||
            String(afiliacion_iva).trim().length <= 0 || String(codigo_moneda).trim().length <= 0 || String(codigo_establecimiento).trim().length <= 0 ||
            String(codigo_pais).trim().length <= 0 || String(departamento).trim().length <= 0 || String(municipio).trim().length <= 0 ||
            String(direccion).trim().length <= 0 || String(codigo_postal).trim().length <= 0) {
            response.code = -1;
            response.data = "La información que se utilizará para la certificación de la factura no es válida";
            return response;
        } else {
            if (Number(certificadorId) <= 0) {
                response.code = -1;
                response.data = "La empresa no cuenta con ningún certificador asignado para la certificación";
                return response;
            } else {
                response.code = 1;
                datosEmpresa = { ...itemEmpresa.dataValues };
                response.data = datosEmpresa;
                return response;
            }
        }
    }
}
const GetDatosCliente = async (personaId) => {
    let response = {};
    const cliente = await bd.query(` select 
	a.personaId,
    concat(a.nombre1,' ',ifnull(a.nombre2,''),' ',ifnull(a.apellido1,''),' ',ifnull(a.apellido2,'')) as nombre,
    a.fecha_nacimiento,
    ifnull(a.email,'') as email,
    (select ifnull(numero_identificacion,'CF') from identificacion_persona where tipo_documentoId=2 and personaId=${personaId} limit 1) as nit ,
    ifnull(b.direccion,'CIUDAD') as direccion,
    c.descripcion as municipio,
    d.descripcion as departamento,
    'GT' as codigoPais,
    '01001' as codigoPostal
    from persona a
    inner join direccion_persona b
    on a.personaId=b.personaId
    inner join cat_municipio c
    on b.municipioId=c.municipioId
    inner join cat_departamento d
    on c.departamentoId=d.departamentoId
    where a.personaId=${personaId} limit 1;`, {
        type: QueryTypes.SELECT
    });
    if (!cliente) {
        response.code = -1;
        response.data = "No se logró encontrar la información del cliente";
    } else if (cliente.length <= 0) {
        response.code = -1;
        response.data = "No se logró encontrar la información del cliente";
    } else {
        response.code = 1;
        response.data = cliente[0];
    }
    return response;
}
const GetDatosCertificador = async ({ certificadorId }) => {
    let response = {};
    let datosCertificador = {};
    let itemCertificador = await Certificador.findOne({
        where: { certificadorId, estadoId: 1 },
        attributes: ['certificadorId', 'nombre', 'nit', 'username', 'password', 'grant_type', 'endpoint_get_token', 'token', 'fecha_expiracion_token', 'endpoint_certifica_dte', 'endpoint_consulta_nit', 'endpoint_consulta_dte', 'endpoint_anula_dte']
    });
    if (!itemCertificador) {
        response.code = -1;
        response.data = "El certificador que tiene asignado la empresa no es valido";
        return response;
    } else {

        let {
            certificadorId = 0,
            nombre = "",
            nit = "",
            username = "",
            password = "",
            grant_type = "",
            endpoint_get_token = "",
            token = "",
            fecha_expiracion_token = undefined,
            endpoint_certifica_dte = ""
        } = itemCertificador;

        if (String(nombre).length <= 0 || String(nit).length <= 0 || String(username).length <= 0 ||
            String(password).length <= 0 || String(grant_type).length <= 0 || String(endpoint_get_token).length <= 0 ||
            String(endpoint_certifica_dte).length <= 0) {
            response.code = -1;
            response.data = "La información del certificador no es valida, por favor verifique";
            return response;
        }
        datosCertificador = { ...itemCertificador.dataValues };
        let tokenVencido = false;
        if (!token) {
            tokenVencido = true;
        }
        if (token && fecha_expiracion_token) {
            let diasVencerToken = moment.duration(moment(fecha_expiracion_token).diff(moment(new Date()))).asDays();
            if (diasVencerToken <= 3) {
                tokenVencido = true;
            }
        }

        if (tokenVencido) {
            response = await GenerarNuevoTokenCertificador(datosCertificador);
            if (response.code !== 1) {
                return response;
            } else {
                datosCertificador.token = response.data;
            }
        }
        response.code = 1;
        response.data = datosCertificador;
        return response;
    }
}
const GenerarNuevoTokenCertificador = async (datosCertificador) => {
    let response = {};
    let { certificadorId } = datosCertificador;
    response = await GenerarToken(datosCertificador);
    if (response.code == 1) {
        let datosUpdate = response.data;
        const resultado = await Certificador.update(datosUpdate, {
            where: { certificadorId }
        });

        if (resultado > 0) {
            response.code = 1;
            response.data = response.data.token;
        } else {
            response.code = -1;
            response.data = "Ocurrió un error al intentar actualiar la información del certificador";
        }
        return response;
    } else {
        return response;
    }
}
const GenerarToken = async (datosCertificador) => {
    let response = {};
    if (datosCertificador.certificadorId = 1) {
        response = await CamaraDelComercioSolicitarToken(datosCertificador);
        if (response.code === 1) {
            let datosUpdate = {};
            datosUpdate.token = response.data.access_token;
            datosUpdate.fecha_emision_token = response.data[".issued"];
            datosUpdate.fecha_expiracion_token = response.data[".expires"];
            response.code = 1;
            response.data = datosUpdate;
            return response;
        } else {
            response.code = -1;
            response.data = "No se logró la comunicación con el certificador, por favor intente nuevamente";
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Por favor comuniquese con el administrador ya que el certificador que se pretende utilizar no se encuentra agregado";
        return response;
    }
}
const CertificarDTE = async (datos) => {
    let response = {};
    let { datosUsuario, datosEmpresa, datosCliente, datosFactura, datosCertificador } = datos;
    let { facturaId, detalle } = datosFactura;
    let info = {};
    let detalleDTE = [];
    detalle.map(({ bienOServicio, nombre, unidadMedida, cantidad, descuento, precio_unitario, precioFila, totalFilaSinIva, totalIva }) => {
        let itemDTE = {};
        itemDTE.bienOServicio = bienOServicio;
        itemDTE.cantidad = Number(Number(cantidad)).toFixed(4);
        itemDTE.unidadMedida = unidadMedida;
        itemDTE.nombre = nombre;
        itemDTE.precioUnitario = Number(Number(precio_unitario)).toFixed(4);
        itemDTE.descuento = Number(Number(descuento)).toFixed(4);
        let listImpuestos = [];
        let itemImpuesto = {};
        itemImpuesto.nombre = "IVA";
        itemImpuesto.codigoUnidadGravable = "1";
        itemImpuesto.montoSinImpuesto = Number(Number(totalFilaSinIva)).toFixed(4);
        itemImpuesto.montoImpuesto = Number(Number(totalIva)).toFixed(4);
        listImpuestos.push(itemImpuesto);
        itemDTE.impuestos = listImpuestos;
        detalleDTE.push(itemDTE);
    });

    datosFactura.detalle = detalleDTE;
    info.datosFactura = datosFactura;
    info.datosEmpresa = datosEmpresa;
    info.datosCliente = datosCliente;
    response = GetXMLDTE(info);
    if (response.code === 1) {
        if (Number(datosCertificador.certificadorId) === 1) {
            let request = {};
            request.xmlDte = Buffer.from(response.data.trim(), 'utf8').toString('base64');
            if (config.facturaElectronica.produccion === true) {
                request.referencia = facturaId; //v4();
            } else {
                request.referencia = v4();
            }
            let dataCamaraDelComerio = {};
            dataCamaraDelComerio.endPoint = datosCertificador.endpoint_certifica_dte;
            dataCamaraDelComerio.request = request;
            dataCamaraDelComerio.token = datosCertificador.token;
            response = await CamaraDelComercioCertificar(dataCamaraDelComerio);
            return response;
        } else {
            response.code = -1;
            response.data = 'El certificador enviado no es valido';
        }
    } else {
        return response;
    }
}
const ConsultaNit = async ({ datosCertificador, nit }) => {
    let response = {};
    if (Number(datosCertificador.certificadorId) === 1) {
        let dataCamaraDelComerio = {};
        let request = {};
        request.Nit = String(nit).trim().replace("-", "");
        dataCamaraDelComerio.endPoint = datosCertificador.endpoint_consulta_nit;
        dataCamaraDelComerio.request = request;
        dataCamaraDelComerio.token = datosCertificador.token;
        return await CamaraDelComercioConsultaNit(dataCamaraDelComerio);
    } else {
        response.code = -1;
        response.data = "El certificador enviado no esta configurado";
        return response;
    }
}
const ConsultaDTE = async ({ datosCertificador, numero_autorizacion }) => {
    let response = {};
    if (Number(datosCertificador.certificadorId) === 1) {
        let dataCamaraDelComerio = {};
        let request = {};
        request.UUID = String(numero_autorizacion).trim();
        dataCamaraDelComerio.endPoint = datosCertificador.endpoint_consulta_dte;
        dataCamaraDelComerio.request = request;
        dataCamaraDelComerio.token = datosCertificador.token;
        return await CamaraDelComercioConsultaDTE(dataCamaraDelComerio);
    }
    else {
        response.code = -1;
        response.data = "El certificador enviado no esta configurado";
        return response;
    }
}
const AnulaDTE = async ({ datosCertificador, datosDTE }) => {
    let response = {};
    if (Number(datosCertificador.certificadorId) === 1) {
        let dataCamaraDelComerio = {};
        response = GetXMLAnulaDTE(datosDTE);
        if (response.code === 1) {
            let request = {};
            request.xmlDte = Buffer.from(response.data.trim(), 'utf8').toString('base64');
            dataCamaraDelComerio.endPoint = datosCertificador.endpoint_anula_dte;
            dataCamaraDelComerio.request = request;
            dataCamaraDelComerio.token = datosCertificador.token;
            return await CamaraDelComercioAnulaDTE(dataCamaraDelComerio);
        } else {
            return response;
        }
    }
    else {
        response.code = -1;
        response.data = "El certificador enviado no esta configurado";
        return response;
    }
}
const validaNit = (nit) => {
    if (!nit) {
        return true;
    }
    let nitRegExp = new RegExp('^[0-9]+(-?[0-9kK])?$');
    if (!nitRegExp.test(nit)) {
        return false;
    }
    nit = nit.replace(/-/, '');
    let lastChar = nit.length - 1;
    let number = nit.substring(0, lastChar);
    let expectedCheker = nit.substring(lastChar, lastChar + 1).toLowerCase();

    let factor = number.length + 1;
    let total = 0;

    for (let i = 0; i < number.length; i++) {
        let character = number.substring(i, i + 1);
        let digit = parseInt(character, 10);

        total += (digit * factor);
        factor = factor - 1;
    }

    let modulus = (11 - (total % 11)) % 11;
    let computedChecker = (modulus == 10 ? "k" : modulus.toString());
    return expectedCheker === computedChecker;
}
module.exports = {
    CertificarDTE,
    GetDatosCertificador,
    GetDatosEmpresa,
    GetDatosCliente,
    ConsultaNit,
    validaNit,
    ConsultaDTE,
    AnulaDTE
}
