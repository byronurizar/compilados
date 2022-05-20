const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const router = express.Router();

const registrar = (req, res, next) => {
    controller.insert(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
const confirmacionCuenta = (req, res, next) => {
    controller.confirmacionCuenta(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
const nuevaConfirmacion = (req, res, next) => {
    controller.nuevaConfirmacion(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}
router.post('/', registrar);
router.put('/', confirmacionCuenta);
router.post('/newconfirmar', nuevaConfirmacion);
module.exports = router;