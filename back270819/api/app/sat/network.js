const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const router = express.Router();

const consultarnit=(req,res,next)=>{
    controller.consultarnit(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}
const consultaDTE=(req,res,next)=>{
    controller.consultaDTE(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}
const anulaDTE=(req,res,next)=>{
    controller.anulaDTE(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

router.get('/consulta/nit/:nit', consultarnit);
router.get('/consulta/dte/:uuid',consultaDTE)
router.post('/anuladte',anulaDTE)

module.exports = router;