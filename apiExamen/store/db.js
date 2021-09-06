const Sequelize = require('sequelize');
const config = require('../config');
const { QueryTypes } = require('sequelize');

const confiBd = new Sequelize(
  config.bd.database,
  config.bd.username,
  config.bd.password,
  {
    host: config.bd.host,
    dialect: config.bd.dialect,
    port: config.bd.port,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: true, //Evitamos que nos muestre lo que hace con la bd
    timezone: "-06:00",
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = confiBd;




const EnfermedadModel = require('./models/cat_enfermedad');
const MedicamentoModel = require('./models/cat_medicamento');
const DoctorModel = require('./models/cat_doctor');
const PacienteModel = require('./models/cat_paciente');
const ConsultaModel = require('./models/consulta');
const ConsultaEnfermedadModel = require('./models/consulta_detalle_enfermedad');
const ConsultaMedicamentoModel = require('./models/consulta_detalle_medicamento');

const Enfermedad = EnfermedadModel(confiBd, Sequelize);
const Medicamento = MedicamentoModel(confiBd, Sequelize);
const Doctor = DoctorModel(confiBd, Sequelize);
const Paciente = PacienteModel(confiBd, Sequelize);
const Consulta = ConsultaModel(confiBd, Sequelize);
const ConsultaEnfermedad = ConsultaEnfermedadModel(confiBd, Sequelize);
const ConsultaMedicamento = ConsultaMedicamentoModel(confiBd, Sequelize);


Consulta.belongsTo(Doctor, {
  as: "Doctor",
  foreignKey: "doctorId",
  onDelete: "CASCADE",
});

Consulta.belongsTo(Paciente, {
  as: "Paciente",
  foreignKey: "pacienteId",
  onDelete: "CASCADE",
});

ConsultaEnfermedad.belongsTo(Enfermedad, {
  as: "Enfermedad",
  foreignKey: "enfermedadId",
  onDelete: "CASCADE",
});

ConsultaMedicamento.belongsTo(Medicamento, {
  as: "Medicamento",
  foreignKey: "medicamentoId",
  onDelete: "CASCADE",
});
db.sequelize.sync();


try {
  confiBd.sync({
    force: false,
  }).then(() => {
    confiBd.query("select count(*) as total from cat_enfermedad", {
      type: QueryTypes.SELECT
    }).then(async (resultado) => {
      if (resultado[0].total === 0) {
        await Enfermedad.bulkCreate(listEnfermedades);
        await Medicamento.bulkCreate(listMedicamentos);
      }
    });
  });
} catch (e) {
  console.error(e);
}

module.exports = {
  Enfermedad,
  Medicamento,
  Doctor,
  Paciente,
  Consulta,
  ConsultaEnfermedad,
  ConsultaMedicamento
}

const listEnfermedades = [
  {
    descripcion: 'Gastritis'
  },
  {
    descripcion: 'Asma'
  },
  {
    descripcion: 'Hipertensión'
  },
  {
    descripcion: 'Gripe'
  }
];

const listMedicamentos = [
  {
    descripcion: 'Ranitidina'
  },
  {
    descripcion: 'Salbutamol'
  },
  {
    descripcion: 'Cloriotacida'
  },
  {
    descripcion: 'Amantadina'
  }
];