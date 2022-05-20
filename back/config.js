module.exports = {
  api: {
    port: process.env.API_PORT || 3100,
    bitacora_cambios: process.env.BITACORA_CAMBIOS || true,
    bitacoraPeticion: process.env.BITACORA_PETICION || true,
    bitacoraError: process.env.BITACORA_ERROR || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "Yahk9Lev5lBdANo6UPQuIgCVHinXsm8M",
  },
  bd: {
    database: "controlgasto",
    username: "doadmin",
    password: "AVNS_xrLb-M1eMMpF0Fo",
    // host: "my-db-server-do-user-7602079-0.b.db.ondigitalocean.com",
    host: "10.124.0.2",
    dialect: "mysql",
    port: 25060,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};