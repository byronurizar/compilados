const express = require('express');
const response = require('../../../network/response');
const controller = require('./controller');
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
const listSucuralesActivas = (req, res, next) => {
    controller.listSucuralesActivas(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}


router.post('/',registrar);
router.get('/', listar);
router.get('/user', listSucuralesActivas);
router.put('/:id',actualizar);
router.delete('/:id',eliminar);
module.exports = router;