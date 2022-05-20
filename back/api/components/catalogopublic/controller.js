var sequelize = require("sequelize");
const { Departamento, Estado, Pais, CatMes, CatMoneda, CatAccessoGrupoGasto, CatCategoriaGrupoGasto, SubCategoriaGrupoGasto, CatPerfilGrupoGasto, PerfilAccesoGrupoGasto } = require('../../../store/db');
const moment = require('moment');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 9;
const Modelo = Departamento;
const tabla = 'cat_departamento';


const list = async (req) => {
    let { catalogo } = req.params;
    let response = {};
    let grupo_gastoId = 1;
    let items = [];
    switch (catalogo) {
        case 'moneda':
            items = await CatMoneda.findAll({
                where: { estadoId: 1 },
                attributes: ['monedaId', "descripcion", "simbolo"]
            });
            break;
        default:
            response.code = -1;
            response.data = "Nombre de catálogo no válido";
            return response;
    }
    if (items.length > 0) {
        response.code = 1;
        response.data = items;
    } else {
        response.code = 1;
        response.data = "El catálogo se encuentra vacio";
    }
    return response;
}

module.exports = {
    list
}