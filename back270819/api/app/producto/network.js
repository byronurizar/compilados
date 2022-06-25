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

const listar=(req,res,next)=>{
    controller.list(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

const filtrar=(req,res,next)=>{
    controller.filtrar(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

const filtrarFacturacion=(req,res,next)=>{
    controller.filtrarFacturacion(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}


const validacionProducto=(req,res,next)=>{
    controller.validar(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

const actualizar = (req, res, next) => {
    controller.update(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}

const eliminar = (req, res, next) => {
    controller.eliminar(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}

router.post('/',registrar);
router.post('/validate',validacionProducto);
router.get('/', listar);
router.post('/filtrar', filtrar);
router.post('/filtrarfact', filtrarFacturacion);
router.put('/:id',actualizar);
router.delete('/:id',eliminar);

module.exports = router;