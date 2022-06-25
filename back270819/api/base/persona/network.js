const express = require('express');
const controller = require('./controller');
const response = require('../../../network/response');
const { uploadExel } = require('../../../utils/funciones/multer.config');
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

const importar = (req, res, next) => {
    controller.importar(req)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(next);
}


router.post('/',registrar);
router.get('/', listar);
router.put('/',actualizar);
router.delete('/:id',eliminar);
router.post('/importar',uploadExel.single('file'),importar);

module.exports = router;