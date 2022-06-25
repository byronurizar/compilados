const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const {upload}=require('../../../utils/funciones/multer.config');
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

const listarCompra=(req,res,next)=>{
    controller.listarCompra(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}


const listarMediaCompra=(req,res,next)=>{
    controller.listarMediaCompra(req)
    .then((data) => {
        response.success(req, res, data, 200);
    })
    .catch(next);
}

router.post('/',upload.array('files',10),registrar);
router.post('/filtrar', listar);
router.get('/:id', listarCompra);
router.get('/media/:id', listarMediaCompra);

module.exports = router;