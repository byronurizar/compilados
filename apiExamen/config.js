// module.exports = {
//     api: {
//       port: process.env.API_PORT || 3100,
//     },
//     bd: {
//       database: "examen",
//       username: "postgres",
//       password: "password",
//       host: "localhost",
//       dialect: "postgres",
//       port: 5432,
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//       },
//     },
//   };
  

  module.exports = {
    api: {
      port: process.env.API_PORT || 3500,
    },
    bd: {
      database: "examen",
      username: "blopez",
      password: "123456789",
      host: "34.123.161.226",
      dialect: "postgres",
      port: 5432,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  };
  