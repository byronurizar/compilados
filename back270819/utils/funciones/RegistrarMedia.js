const { Media, MediaDetalle } = require("../../store/db");

const RegistrarMedia = async (archivos, transaction,usuario_crea) => {
    try {
        let alertas = [];
        let errores = 0;
        const { mediaId = undefined } = await Media.create({usuario_crea}, { transaction });
        if (mediaId > 0) {
            for await (let archivo of archivos) {
                let item = {
                    mediaId,
                    nombre: archivo.originalname,
                    mimetype: archivo.mimetype,
                    blob: archivo.buffer,
                    usuario_crea
                }
                let { media_detalleId = 0 } = await MediaDetalle.create(item, { transaction });
                if (media_detalleId > 0) {
                    errores++;
                    alertas.push({
                        productoId: '',
                        producto: '',
                        codigo: '',
                        alerta: `El archivo ${archivo.originalname} no se logro cargar`
                    });
                }
            }
            if (errores === 0) {
              return {
                  code:mediaId
              }
            } else {
                let data = {
                    mensaje: "No se lograron cargar los archivos correctamente",
                    alerta: alertas
                }
                return {
                    code: mediaId,
                    data
                }
            }
        } else {
            return {
                code: -1,
                data: "Ocurrió un error al intentar registrar los archivos"
            }
        }
    } catch (error) {
        return {
            code: -1,
            data: error.message
        }
    }
}

module.exports = {
    RegistrarMedia
}