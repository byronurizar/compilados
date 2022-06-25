const { LoteProducto, Estado, Sucursal } = require('../../../store/db');
const { registrarBitacora } = require('../../../utils/bitacora_cambios');
const { validarpermiso } = require('../../../auth');
const MenuId = 39;
const Modelo = LoteProducto;
const tabla = 'lote_producto';
let response = {};

const consultar = async (query, include = 1) => {
    if (include == 1) {
        if (query) {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: {
                        exclude: ["fecha_crea", "usuario_ult_mod", "fecha_ult_mod"],
                    }
                },
                {
                    model: Sucursal,
                    as: "Sucursal",
                    required: true,
                    attributes: ['sucursalId', 'nombre']
                }
                ],
                where: [query],
                order: [
                    ['fecha_vencimiento', 'ASC']
                ]
            });
        } else {
            return await Modelo.findAll({
                include: [{
                    model: Estado,
                    as: "Estado",
                    required: true,
                    attributes: {
                        exclude: ["fecha_crea", "usuario_ult_mod", "fecha_ult_mod"],
                    }
                }, {
                    model: Sucursal,
                    as: "Sucursal",
                    required: true,
                    attributes: ['sucursalId', 'nombre']
                }
                ],
                order: [
                    ['fecha_vencimiento', 'ASC']
                ]
            });
        }
    } else {
        if (query) {
            return await Modelo.findAll({ where: query });
        } else {
            return await Modelo.findAll();
        }
    }
}

const list = async (req) => {
    let autorizado = await validarpermiso(req, MenuId, 3);
    if (autorizado !== true) {
        return autorizado;
    }
    const { include } = req.query;
    if (!req.query.id && !req.query.estadoId && !req.query.productoId) {
        response.code = 1;
        response.data = await consultar(null, include);
        return response;
    }

    const { id, estadoId, productoId } = req.query;
    let query = {};
    if (estadoId) {
        let estados = estadoId.split(';');
        let arrayEstado = new Array();
        estados.map((item) => {
            arrayEstado.push(Number(item));
        });
        query.estadoId = arrayEstado;
    }
    if (productoId) {
        query.productoId = productoId;
    }

    if (!id) {
        response.code = 1;
        response.data = await consultar(query, include);
        return response;
    } else {
        if (Number(id) > 0) {
            query.lote_productoId = Number(id);
            response.code = 1;
            response.data = await consultar(query, include);
            return response;
        } else {
            response.code = -1;
            response.data = "Debe de especificar un codigo";
            return response;
        }
    }
}

module.exports = {
    list
}