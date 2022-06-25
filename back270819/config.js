module.exports = {
  api: {
    port: process.env.API_PORT || 3200,
    bitacora_cambios: process.env.BITACORA_CAMBIOS || true,
    bitacoraPeticion: process.env.BITACORA_PETICION || true,
    bitacoraError: process.env.BITACORA_ERROR || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "Yahk9Lev5lBdANo6UPQuIgCVHinXsm8M",
  },
  facturaElectronica: {
    produccion: false,
    urlQr:"https://felpub.c.sat.gob.gt/verificador-web/publico/vistas/verificacionDte.jsf?tipo=autorizacion&numero={numeroAutorizacion}&emisor={nitEmisor}&receptor={nitReceptor}&monto={monto}",
  },
  bd: {
    database: "desa_conta2",
    username: "doadmin",
    password: "AVNS_xrLb-M1eMMpF0Fo",
    host: "",
    dialect: "mysql",
    port: 25060,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  optionsHtmlPdf : {
    //port:9922
  }
};
