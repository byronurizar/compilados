const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('../config');
const errors = require('../network/errors');
require("../store/db");
const Enfermedad = require('./components/enfermedad/network');
const Medicamento = require('./components/medicamento/network');
const Doctor = require('./components/doctor/network');
const Paciente = require('./components/paciente/network');
const Consulta = require('./components/consulta/network');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api/enfermedad', Enfermedad);
app.use('/api/medicamento', Medicamento);
app.use('/api/doctor', Doctor);
app.use('/api/paciente', Paciente);
app.use('/api/consulta', Consulta);


app.use(errors);

app.listen(config.api.port, () => {
    console.log('Api escuchando en el puerto ', config.api.port);
});
