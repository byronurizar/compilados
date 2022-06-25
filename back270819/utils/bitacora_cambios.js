const moment = require('moment');
const { BitacoraCambios } = require('../store/db');
const config = require('../config');
const registrarBitacora = async (req, tabla, modificadoId, dataAnterior, dataNueva, transaction = false) => {
    if (config.api.bitacora_cambios) {
        try {

            delete dataNueva.fecha_crea;
            delete dataNueva.fecha_ult_mod;
            let keys = Object.keys(dataNueva);
            let { usuario_ult_mod } = dataNueva;
            let { empresaId } = req.user;
            keys.map(async (campo) => {
                let valor_anterior = dataAnterior[campo];
                let valor_nuevo = dataNueva[campo];
                let tipo_dato;
                if (valor_anterior == null) {
                    valor_anterior = 'null';
                    tipo_dato = 'string';
                }
                if (valor_anterior != valor_nuevo && valor_nuevo!==undefined) {
                    tipo_dato = !tipo_dato && typeof (valor_anterior);
                    if (tipo_dato === 'object') {
                        valor_anterior = moment(valor_anterior).format('YYYY/MM/DD HH:mm');
                        valor_nuevo = moment(valor_nuevo).format('YYYY/MM/DD HH:mm');
                    }
                    if(valor_anterior==null){
                        valor_anterior=undefined;
                    }
                    if(valor_nuevo==null){
                        valor_nuevo=undefined;
                    }
                    let data = {
                        tabla,
                        campo,
                        modificadoId,
                        tipo_dato,
                        valor_anterior,
                        valor_nuevo,
                        usuario_crea: usuario_ult_mod,
                        empresaId
                    }
                    if (!transaction) {
                        resultado = await BitacoraCambios.create(data);
                    } else {
                        resultado = await BitacoraCambios.create(data, { transaction });
                    }
                }
            });
            return true;
        } catch (error) {
            console.log("Ocurrio un error al registrar la bitacora", error);
            return false;
        }
    }else{
        return true;
    }
}

module.exports = {
    registrarBitacora
}