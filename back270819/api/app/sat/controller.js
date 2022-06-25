const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { Factura, bd, IdentificacionPersona, Persona, DireccionPersona, Municipio, Departamento } = require("../../../store/db");
const { GetDatosEmpresa, GetDatosCertificador, ConsultaNit, validaNit, ConsultaDTE, AnulaDTE } = require("../../../utils/funciones/FacturaElectronica");



const consultarnit = async (req) => {
    let { usuarioId, empresaId } = req.user;
    let { nit } = req.params;
    let response = {};
    let datosEmpresa = {};

    nit = String(nit).trim().replace("-", "");
    if (String(nit).trim().length <= 0) {
        response.code = -1;
        response.data = "Debe enviar la información del nit";
        return response;
    }
    if (!validaNit(nit)) {
        response.code = -1;
        response.data = "El número de nit ingresado no es valido";
        return response;
    }
    let itemIdentificacionPersona = await IdentificacionPersona.findOne({
        where: { numero_identificacion: nit, tipo_documentoId: 2, estadoId: 1 }
    });
    if (itemIdentificacionPersona) {
        let { personaId } = itemIdentificacionPersona;
        if (Number(personaId) > 0) {
            let itemPersona = await Persona.findOne({
                where: { empresaId, personaId, estadoId: 1 },
                attributes: ['personaId', 'empresaId', 'es_empleado', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nacimiento', 'generoId', 'email']
            });

            let {numero_identificacion}=itemIdentificacionPersona;

            let itemDireccionPersona=await DireccionPersona.findOne({
                where:{personaId},
                attributes: ['direccion_personaId', 'personaId', 'municipioId', 'direccion'],
                include:[
                    {
                        model: Municipio,
                        as: "Municipio",
                        required: true,
                        attributes: ['municipioId','departamentoId','descripcion'],
                    }
                ]
            });

            let direccion_personaId=0;
            let departamentoId=0;
            let municipioId=0;
            let direccion="";
            let direccionShow="";
            if(itemDireccionPersona){
                let {direccion_personaId:direccion_personaIdSearch,direccion:direccionSearch,Municipio:{municipioId:municipioIdSearch,descripcion:nombreMunicipio,departamentoId:departamentoIdSearch}}=itemDireccionPersona;
                direccion_personaId=direccion_personaIdSearch;
                municipioId=municipioIdSearch;
                departamentoId=departamentoIdSearch;
                direccion=direccionSearch;
                let itemDepto=await Departamento.findOne({
                    where:{departamentoId}
                });
                let {descripcion:nombreDepto}=itemDepto;
                direccionShow=`${direccion},${nombreMunicipio},${nombreDepto}`;
            }
            if (itemPersona) {
                let { personaId = 0, es_empleado = false, nombre1 = "", nombre2 = "", apellido1 = "", apellido2 = "", fecha_nacimiento, generoId, email = "" } = itemPersona;
                let nombreCompleto = `${nombre1} ${nombre2?nombre2:""} ${apellido1?apellido1:""} ${apellido2?apellido2:""}`;
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
                    nit:numero_identificacion,
                    nuevo:false,
                    direccion_personaId,
                    departamentoId,
                    municipioId,
                    direccion,
                    direccionShow
                }
                response.code=1;
                response.data = infoCliente;
                return response;
            }
        }
    }

    response = await GetDatosEmpresa(empresaId);
    if (response.code === 1) {
        datosEmpresa = response.data;
        response = await GetDatosCertificador(datosEmpresa);
        if (response.code === 1) {
            let datos = {};
            datos.datosCertificador = response.data;
            datos.nit = nit;
            response = await ConsultaNit(datos);
            if (response.code === 1) {
                let { nombre, nit } = response.data;
                let infoReg = {};
                infoReg.usuarioId = usuarioId;
                infoReg.empresaId = empresaId;
                infoReg.nombre = nombre;
                infoReg.nit = nit;
                response = await registrar(infoReg);
                return response;
            } else {
                return response;
            }
        } else {
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Ocurrió un error al intentar obtener la información de la empresa";
    }
    return response;
}
const registrar = async (datos) => {
    let datosNewItem = {};
    let response = {};
    datosNewItem.empresaId = datos.empresaId;
    datosNewItem.nombre1 = datos.nombre;
    datosNewItem.usuario_crea = datos.usuarioId;
    datosNewItem.es_empleado = false;
    datosNewItem.nuevo = true;
    let regPersona = await Persona.create(datosNewItem);
    datosNewItem.nombreCompleto = datos.nombre;
    if (regPersona) {
        let { personaId } = regPersona;
        let datNewIdentificacion = {};
        datNewIdentificacion.personaId = personaId;
        datNewIdentificacion.tipo_documentoId = 2;
        datNewIdentificacion.numero_identificacion = datos.nit;
        datNewIdentificacion.usuario_crea = datos.usuarioId;
        datosNewItem.personaId = personaId;
        datosNewItem.nit = datos.nit;
        let regIdentificacion = await IdentificacionPersona.create(datNewIdentificacion);
        if (regIdentificacion) {
            let {identificacion_personaId}=regIdentificacion;
            datosNewItem.identificacion_personaId=identificacion_personaId;
            response.code = 1;
            response.data = datosNewItem;
            return response;
        } else {
            response.code = -1;
            response.data = "Ocurrió un error al registrar la información";
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Ocurrió un error al registrar la información";
        return response;
    }
}
const consultaDTE = async (req) => {
    let { uuid } = req.params;
    let { usuarioId, empresaId } = req.user;
    let response = {};
    if (String(uuid).length <= 0) {
        response.code = -1;
        response.data = "Debe de enviar el número de autorización de la factura, para poder realizar la consulta";
        return response;
    }
    let itemFactura = await Factura.findOne({
        where: { empresaId, numero_autorizacion: uuid }
    });
    if (!itemFactura) {
        response.code = -1;
        response.data = "El número de autorización enviado no existe en nuestros registros";
        return response;
    }
    let { facturaId } = itemFactura;
    if (Number(facturaId) <= 0) {
        response.code = -1;
        response.data = "El número de factura no es valido, por favor comuniquese con el administrador";
        return response;
    }

    const datos_certificacion = await bd.query(`
        select 
        a.facturaId,
        a.numero_autorizacion,
        a.serie,
        a.numeroDTE,
        a.fecha_crea,
        a.fecha_hora_certificacion,
        b.nombre as certificador,
        b.nit as nit_certificador,
        (
            select  descripcion From cat_estado where estadoId=a.estadoId
        ) as estado_factura,
        c.nombre as sucursal,
        c.direccion as direccion_sucursal,
        concat(d.nombre1,' ',d.apellido1) as cliente,
        e.descripcion tipo_dte,
        f.nombre tipo_pago,
        (
        select concat(person.nombre1,' ',person.apellido1) from persona person where person.personaId=g.personaId
        ) as usuario_emite
        from factura a
        inner join cat_certificador b
        on a.certificadorId=b.certificadorId
        inner join cat_sucursal c
        on a.sucursalId=c.sucursalId
        inner join persona d
        on a.personaId=d.personaId
        inner join cat_tipo_dte e
        on a.tipo_dteId=e.tipo_dteId
        inner join cat_tipo_pago f
        on a.tipo_pagoId=f.tipo_pagoId
        inner join usuario g
        on a.usuario_crea=g.usuarioId
        where a.facturaId=${facturaId};`, {
        type: QueryTypes.SELECT
    });

    let itemEncontrado = datos_certificacion[0];
    if (!itemEncontrado) {
        response.code = -1;
        response.data = "No se logró encontrar información del número de autorización en la base de datos";
        return response;
    }
    response = await GetDatosEmpresa(empresaId);
    if (response.code === 1) {
        datosEmpresa = response.data;
        response = await GetDatosCertificador(datosEmpresa);
        if (response.code === 1) {
            let datos = {};
            datos.datosCertificador = response.data;
            datos.numero_autorizacion = itemEncontrado.numero_autorizacion;
            let { nombre, nit } = datos.datosCertificador;
            response = await ConsultaDTE(datos);
            if (response.code === 1) {
                let result = {};
                result.datosDB = itemEncontrado;
                let infoCertificador = {};
                infoCertificador.certificador = {
                    nombre,
                    nit
                };
                infoCertificador.datos = response.data;
                result.certificacion = infoCertificador;
                response.code = 1;
                response.data = result;
                return response;
            }
            return response;
        } else {
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Ocurrió un error al intentar obtener la información de la empresa";
        return response;
    }
}
const anulaDTE = async (req) => {
    let { usuarioId, empresaId } = req.user;
    let { facturaId = "", motivo = "" } = req.body;
    let datos = {};
    let response = {};
    if (Number(facturaId) <= 0) {
        response.code = -1;
        response.data = "El número de la factura no es válido";
        return response;
    }
    if (String(motivo).trim().length <= 10) {
        response.code = -1;
        response.data = "El motivo de la anulación debe de contener más información";
        return response;
    }

    response = await GetDatosEmpresa(empresaId);
    if (response.code === 1) {
        datosEmpresa = response.data;
        response = await GetDatosCertificador(datosEmpresa);
        if (response.code === 1) {
            const infoFacturaAnular = await bd.query(`
            select a.facturaId,a.numero_autorizacion,b.nit as niteEmisor,a.fecha_crea as fechaHoraEmision,d.numero_identificacion as nitReceptor  from factura a
            inner join cat_empresa b
            on a.empresaId=b.empresaId
            inner join persona c
            on a.personaId=c.personaId
            inner join identificacion_persona d
            on c.personaId=d.personaId and d.tipo_documentoId=2
            and a.estadoId=1 and b.estadoId=1 and c.estadoId=1 and d.estadoId=1
            where a.facturaId=${facturaId} and a.empresaId=${empresaId};`, {
                type: QueryTypes.SELECT
            });

            if (!infoFacturaAnular) {
                response.code = -1;
                response.data = "No se logró encontrar la información de la factura a anular";
                return response;
            }
            if (infoFacturaAnular.length === 1) {
                let [datosFactura] = infoFacturaAnular;
                datos.numero_autorizacion = datosFactura.numero_autorizacion;
                datos.niteEmisor = datosFactura.niteEmisor;
                datos.nitReceptor = datosFactura.nitReceptor;
                datos.fechaHoraEmision = moment(datosFactura.fechaHoraEmision).format();
                datos.fechaHoraAnulacion = moment(new Date()).format();
                datos.motivoAnulacion = motivo;
                let datosCertificador = response.data;
                let info = {};
                info.datosCertificador = datosCertificador;
                info.datosDTE = datos;
                response = await AnulaDTE(info);
                if (response.code === 1) {
                    let datosUpdateFactura = {
                        estadoId: 4,
                        usuario_ult_mod: usuarioId,
                        fecha_ult_mod: moment(new Date()).format('YYYY/MM/DD HH:mm')
                    };
                    const resultado = await Factura.update(datosUpdateFactura, {
                        where: {
                            facturaId
                        }
                    });
                    if (resultado > 0) {
                        response.code = -1;
                        response.data = `Anulación de Factura No.${facturaId} con número de autorización ${datosFactura.numero_autorizacion} fue anulada exitosamente`;
                        return response;
                    } else {
                        response.code = -3;
                        response.data = "Ocurrió un error al intentar realizar la anulación de la factura en la base de datos, pero si se anuló en la SAT";
                        return response;
                    }
                } else {
                    return response;
                }
            } else {
                response.code = -1;
                response.data = "La información de la factura, no es valida";
                return response;
            }
        } else {
            return response;
        }
    } else {
        response.code = -1;
        response.data = "Ocurrió un error al intentar obtener la información de la empresa";
        return response;
    }


}
module.exports = {
    consultarnit,
    consultaDTE,
    anulaDTE
}