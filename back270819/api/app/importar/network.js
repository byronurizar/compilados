const express = require('express');
const controller = require('./controller');
const { uploadExel } = require('../../../utils/funciones/multer.config');
const router = express.Router();

const Importar = (req, res, next) => {
    controller.Importar(req,res,next);
}
const ExportarPlantilla=(req,res,next)=>{
    controller.ExportarPlantilla(req,res,next);
}

router.post('/:tipo',uploadExel.single('file'),Importar);
router.get('/:tipo',ExportarPlantilla);

module.exports=router;
