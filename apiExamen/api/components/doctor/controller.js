const { Doctor } = require("../../../store/db");

const insert = async (req) => {
    let response = {};
    let { nombre, direccion, telefono } = req.body;
    let itemInsert = await Doctor.create({ nombre, direccion, telefono });
    response.code = 1;
    response.data = itemInsert;

    return response;
}

const list = async (req) => {
    let response = {};
    response.code = 1;
    response.data = await Doctor.findAll();
    return response;
}

const update = async (req) => {
    let response = {};
    let { id } = req.params;
    if (Number(id) > 0) {
        const dataActual = await Doctor.findOne({
            where: { doctorId: id }
        });

        if (dataActual) {
            let { nombre, direccion, telefono } = req.body;
            let data = {
                nombre,
                direccion,
                telefono,
                fecha_ult_mod:new Date()
            }
            const resultado = await Doctor.update(data, {
                where: {
                    doctorId:id
                }
            });

            if (resultado > 0) {
                response.code = 1;
                response.data = "Información del doctor actualizada exitosamente";
                return response;
            } else {
                response.code = 0;
                response.data = "No existen cambios para aplicar";
                return response;
            }
        } else {
            response.code = 0;
            response.data = "El código del doctor ingresado no existe";
            return response;
        }

    } else {
        response.code = 0;
        response.data = "El código del doctor ingresado no existe";
        return response;
    }
}

module.exports = {
    insert,
    list,
    update
}