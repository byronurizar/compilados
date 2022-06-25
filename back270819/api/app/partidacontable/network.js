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

const filtrarPartidas = (req, res, next) => {
    controller.filtrarPartidas(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}


const listar=(req,res,next)=>{
    controller.list(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

const listarPartida=(req,res,next)=>{
    controller.listarPartida(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}


const listarcontraparte=(req,res,next)=>{
    controller.listarcontraparte(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}


router.post('/',registrar);
router.post('/filtrar',filtrarPartidas);
router.get('/', listar);
router.get('/:id', listarPartida);
router.get('/listcontraparte/:id', listarcontraparte);
module.exports = router;