const moment = require('moment');
const modeloDTE = `
<?xml version="1.0" encoding="utf-8"?>
<dte:GTDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.2.0" Version="0.1">
  <dte:SAT ClaseDocumento="dte">
    <dte:DTE ID="DatosCertificados">
      <dte:DatosEmision ID="DatosEmision">
        <dte:DatosGenerales CodigoMoneda="{codigoMoneda}" FechaHoraEmision="{fechaHoraEmision}" Tipo="{tipo}" />
        <dte:Emisor AfiliacionIVA="{afiliacionIva}" CodigoEstablecimiento="{codigoEstablecimiento}" CorreoEmisor="{correoEmisor}" NITEmisor="{nitEmisor}" NombreComercial="{nombreComercial}" NombreEmisor="{nombreEmisor}">
          <dte:DireccionEmisor>
            <dte:Direccion>{direccionEmisor}</dte:Direccion>
            <dte:CodigoPostal>{codigoPostalEmisor}</dte:CodigoPostal>
            <dte:Municipio>{municipioEmisor}</dte:Municipio>
            <dte:Departamento>{departamentoEmisor}</dte:Departamento>
            <dte:Pais>{paisEmisor}</dte:Pais>
          </dte:DireccionEmisor>
        </dte:Emisor>
        <dte:Receptor CorreoReceptor="{correoReceptor}" IDReceptor="{nitReceptor}" NombreReceptor="{nombreReceptor}">
          <dte:DireccionReceptor>
            <dte:Direccion>{direccionReceptor}</dte:Direccion>
            <dte:CodigoPostal>{codigoPostalReceptor}</dte:CodigoPostal>
            <dte:Municipio>{municipioReceptor}</dte:Municipio>
            <dte:Departamento>{departamentoReceptor}</dte:Departamento>
            <dte:Pais>{paisReceptor}</dte:Pais>
          </dte:DireccionReceptor>
        </dte:Receptor>
        <dte:Frases>
          {frases}
        </dte:Frases>
        <dte:Items>
         {items}
        </dte:Items>
        <dte:Totales>
          {totales}
        </dte:Totales>
      </dte:DatosEmision>
    </dte:DTE>
  </dte:SAT>
</dte:GTDocumento>
`;
const modeloItemFrase = `
<dte:Frase CodigoEscenario="{codigoEscenario}" TipoFrase="{tipoFrase}" />
`;
const modeloFila = `
    <dte:Item BienOServicio="{bienOServicio}" NumeroLinea="{numeroLinea}">
    <dte:Cantidad>{cantidad}</dte:Cantidad>
    <dte:UnidadMedida>{unidadMedida}</dte:UnidadMedida>
    <dte:Descripcion>{descripcion}</dte:Descripcion>
    <dte:PrecioUnitario>{precioUnitario}</dte:PrecioUnitario>
    <dte:Precio>{precio}</dte:Precio>
    <dte:Descuento>{descuento}</dte:Descuento>
    <dte:Impuestos>
        {impuestos}
    </dte:Impuestos>
    <dte:Total>{total}</dte:Total>
</dte:Item>
`;
const modeloImpuesto = `
    <dte:Impuesto>
        <dte:NombreCorto>{nombre}</dte:NombreCorto>
        <dte:CodigoUnidadGravable>{codigoUnidadGravable}</dte:CodigoUnidadGravable>
        <dte:MontoGravable>{montoGravable}</dte:MontoGravable>
        <dte:MontoImpuesto>{montoImpuesto}</dte:MontoImpuesto>
    </dte:Impuesto>
`;
const modeloTotales = `
<dte:TotalImpuestos>
    {totalImpuestos}
<dte:GranTotal>{granTotal}</dte:GranTotal>`;
const modeloItemImpuestos = `
<dte:TotalImpuesto NombreCorto="{nombre}" TotalMontoImpuesto="{monto}" />
</dte:TotalImpuestos>`;

const modeloxmlAnulaDTE = `
<?xml version="1.0" encoding="utf-8"?>
<dte:GTAnulacionDocumento xmlns:dte="http://www.sat.gob.gt/dte/fel/0.1.0" Version="0.1">
  <dte:SAT>
    <dte:AnulacionDTE ID="DatosCertificados">
      <dte:DatosGenerales ID="DatosAnulacion" NumeroDocumentoAAnular="{numero_autorizacion}" NITEmisor="{niteEmisor}" IDReceptor="{nitReceptor}" FechaEmisionDocumentoAnular="{fechaHoraEmision}" FechaHoraAnulacion="{fechaHoraAnulacion}" MotivoAnulacion="{motivoAnulacion}" />
    </dte:AnulacionDTE>
  </dte:SAT>
</dte:GTAnulacionDocumento>
`;

const GetXMLDTE = (datos) => {
  let response = {};
  try {
    let infoTransformada = TransformarDatos(datos);
    let { encabezado, frases, cuerpo, pie } = infoTransformada;
    let xmlDte = modeloDTE;
    let xmlItemFrase = modeloItemFrase;
    let xmlFila = modeloFila;
    let xmlImpueto = modeloImpuesto;
    let xmlItemImpuestos = modeloItemImpuestos;
    let xmlTotales = modeloTotales;
    let listCamposEncabezado = Object.keys(encabezado);
    listCamposEncabezado.map((campo) => {
      let valor = encabezado[campo];
      xmlDte = xmlDte.replace(`{${campo}}`, valor);
    });
    let xmlFrases = '';
    frases.map((item) => {
      let nuevoItem = xmlItemFrase;
      let listCampoItem = Object.keys(item);
      listCampoItem.map((campo) => {
        let valor = item[campo];
        nuevoItem = nuevoItem.replace(`{${campo}}`, valor);
      });
      xmlFrases += nuevoItem.trim();
    });
    xmlDte = xmlDte.replace(`{frases}`, xmlFrases.trim());

    let { items } = cuerpo;
    let xmlProductos = '';
    items.map(({ bienOServicio, cantidad, unidadMedida, descripcion, precioUnitario, precio, descuento, impuestos, total }, index) => {
      let nuevoItem = xmlFila;
      nuevoItem = nuevoItem.replace(`{bienOServicio}`, bienOServicio);
      nuevoItem = nuevoItem.replace(`{numeroLinea}`, Number(index + 1));
      nuevoItem = nuevoItem.replace(`{cantidad}`, cantidad);
      nuevoItem = nuevoItem.replace(`{unidadMedida}`, unidadMedida);
      nuevoItem = nuevoItem.replace(`{descripcion}`, descripcion);
      nuevoItem = nuevoItem.replace(`{precioUnitario}`, precioUnitario);
      nuevoItem = nuevoItem.replace(`{precio}`, precio);
      nuevoItem = nuevoItem.replace(`{descuento}`, descuento);
      let xmlImpuestos = '';
      impuestos.map((item) => {
        let nuevoImpuesto = xmlImpueto;
        let listCampoImpuesto = Object.keys(item);
        listCampoImpuesto.map((campo) => {
          let valor = item[campo];
          nuevoImpuesto = nuevoImpuesto.replace(`{${campo}}`, valor);
        });
        xmlImpuestos += nuevoImpuesto.trim();
      });
      nuevoItem = nuevoItem.replace(`{impuestos}`, xmlImpuestos.trim());
      nuevoItem = nuevoItem.replace(`{total}`, total);
      xmlProductos += nuevoItem.trim();
    });
    xmlDte = xmlDte.replace(`{items}`, xmlProductos.trim());

    let { totales } = pie;
    let { totalImpuesto, granTotal } = totales;

    let xmlXmlImpuestosPie = '';
    totalImpuesto.map((item) => {
      let nuevoElemento = xmlItemImpuestos;
      let listCampoImpuesto = Object.keys(item);
      listCampoImpuesto.map((campo) => {
        let valor = item[campo];
        nuevoElemento = nuevoElemento.replace(`{${campo}}`, valor);
      });
      xmlXmlImpuestosPie += nuevoElemento.trim();
    });
    xmlTotales = xmlTotales.replace("{totalImpuestos}", xmlXmlImpuestosPie.trim());
    xmlTotales = xmlTotales.replace("{granTotal}", Number(Number(granTotal).toFixed(4)));
    xmlDte = xmlDte.replace(`{totales}`, xmlTotales.trim()).trim();
    response.code = 1;
    response.data = xmlDte;
  } catch {
    response.code = -1;
    response.data = "Ocurrió un error al intentar generar el XML para la certificación, por favor comuniquese con el administrador";
  }
  return response;
}
const TransformarDatos = (data) => {
  let { datosFactura, datosEmpresa, datosCliente } = data;
  let { detalle = [] } = datosFactura;
  let itemsDTE = [];
  let listaImpuestos = [];
  let totalGeneralConDescuento = 0;
  detalle.map((item) => {
    let fila = {};
    let totalFila = 0;
    let impuestoAplicable = [];
    fila.bienOServicio = item.bienOServicio;
    fila.cantidad = Number(item.cantidad).toFixed(4);
    fila.unidadMedida = item.unidadMedida;
    fila.descripcion = item.nombre;
    fila.precioUnitario = Number(Number(item.precioUnitario).toFixed(4));
    fila.precio = Number(Number(Number(Number(item.cantidad).toFixed(4)) * Number(Number(item.precioUnitario).toFixed(4))).toFixed(4));
    fila.descuento = Number(Number(item.descuento).toFixed(4));
    fila.impuestos = [];
    totalGeneralConDescuento += Number(Number(Number(Number(fila.precio).toFixed(4)) - Number(Number(fila.descuento).toFixed(4))).toFixed(4));
    item.impuestos.map(itemImpuesto => {
      let impuesto = {};
      impuesto.nombre = itemImpuesto.nombre;
      let existe = listaImpuestos.find(i => String(i.nombre).trim() === String(itemImpuesto.nombre).trim());
      if (existe) {
        let nuevoListado = listaImpuestos.map(listFila => {
          if (String(listFila.nombre).trim() === String(itemImpuesto.nombre).trim()) {
            listFila.monto = Number(Number(Number(Number(listFila.monto).toFixed(4)) + Number(Number(itemImpuesto.montoImpuesto).toFixed(4))).toFixed(4));
            return listFila;
          } else {
            return listFila;
          }
        });
        listaImpuestos = nuevoListado;
      } else {
        listaImpuestos.push({
          nombre: String(itemImpuesto.nombre).trim(),
          monto: Number(Number(itemImpuesto.montoImpuesto).toFixed(4))
        });
      }
      impuesto.codigoUnidadGravable = itemImpuesto.codigoUnidadGravable;
      impuesto.montoGravable = Number(itemImpuesto.montoSinImpuesto).toFixed(4);
      impuesto.montoImpuesto = Number(itemImpuesto.montoImpuesto).toFixed(4);
      impuestoAplicable.push(impuesto);
      totalFila += Number(Number(itemImpuesto.montoSinImpuesto).toFixed(4)) + Number(Number(itemImpuesto.montoImpuesto).toFixed(4));
    });
    fila.impuestos = impuestoAplicable;
    fila.total = Number(totalFila);
    itemsDTE.push(fila);
  });

  const listDatosParaCertificar = {
    encabezado: {
      fechaHoraEmision: moment(datosFactura.fechaFactura).format(),
      codigoMoneda: datosEmpresa.codigo_moneda,
      tipo: datosEmpresa.tipoDTE,
      afiliacionIva: datosEmpresa.afiliacion_iva,
      codigoEstablecimiento: datosEmpresa.codigo_establecimiento,
      correoEmisor: datosEmpresa.email,
      nitEmisor: String(datosEmpresa.nit).replace("-", ""),
      nombreComercial: datosEmpresa.nombre_comercial,
      nombreEmisor: datosEmpresa.razon_social,
      departamentoEmisor: datosEmpresa.departamento,
      municipioEmisor: datosEmpresa.municipio,
      direccionEmisor: datosEmpresa.direccion,
      codigoPostalEmisor: datosEmpresa.codigo_postal,
      paisEmisor: datosEmpresa.codigo_pais,
      correoReceptor: datosCliente.email,
      nitReceptor: String(datosCliente.nit).replace("-", ""),
      nombreReceptor: String(datosCliente.nombre).replace("  ", " ").trim(),
      departamentoReceptor: datosCliente.departamento,
      municipioReceptor: datosCliente.municipio,
      direccionReceptor: datosCliente.direccion,
      codigoPostalReceptor: datosCliente.codigoPostal,
      paisReceptor: datosCliente.codigoPais,
    },
    frases: [
      {
        codigoEscenario: datosEmpresa.codigo_escenario,
        tipoFrase: datosEmpresa.codigo_frase
      }
    ],
    cuerpo: {
      items: itemsDTE
    },
    pie: {
      totales: {
        totalImpuesto: listaImpuestos,
        granTotal: Number(Number(totalGeneralConDescuento).toFixed(4))
      }
    }
  };
  return listDatosParaCertificar;
}
const GetXMLAnulaDTE = (datos) => {
  let response = {};
  try {
    let xmlAnula = modeloxmlAnulaDTE;
    let listItems = Object.keys(datos);
    listItems.map((campo) => {
      let valor = datos[campo];
      xmlAnula = xmlAnula.replace(`{${campo}}`, valor);
    });
    response.code = 1;
    response.data = xmlAnula;
  } catch {
    response.code = -1;
    response.data = "Ocurrió un error al momento de intentar generar el xml para la anulación de la factura";
  }
  return response;
}
module.exports = {
  GetXMLDTE,
  GetXMLAnulaDTE
}