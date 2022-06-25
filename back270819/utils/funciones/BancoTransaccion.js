var sequelize = require("sequelize");
const { CuentaBancariaTransaccion, CuentaBancaria } = require("../../store/db");

const Registrar = async (transaction, dataTransaccion, usuario_crea, empresaId) => {
    let response = {};
    let { cuenta_bancariaId, descripcion, fecha = undefined, monto = 0, referencia,partida_contableId=undefined } = dataTransaccion;
    let InfoCuenta = await CuentaBancaria.findOne({
        where: { cuenta_bancariaId, empresaId },
        attributes: ['cuenta_bancariaId', 'banco', 'nombre_cuenta', 'numero_cuenta'],
        transaction
    });

    if (InfoCuenta) {
        let { banco, nombre_cuenta, numero_cuenta } = InfoCuenta;
        if (Number(monto) < 0) {
            let InfoSaldo = await CuentaBancariaTransaccion.findOne({
                where: { cuenta_bancariaId },
                attributes: [[sequelize.literal("Sum(monto)"), 'monto']],
                transaction
            });
            let { monto: saldoActual = undefined } = InfoSaldo;
            if (!saldoActual) {
                response.code = -1;
                response.data = `En la cuenta ${nombre_cuenta} con número ${numero_cuenta} del banco ${banco} no cuenta con transacciones de crédito`;
            } else {
                if (Number(Math.abs(monto)) > Number(saldoActual)) {
                    response.code = -1;
                    response.data = `El Saldo de la cuenta ${nombre_cuenta} con número ${numero_cuenta} del banco ${banco} es insuficiente para completar la transacción`;
                } else {
                    let infoT = {
                        partida_contableId,
                        cuenta_bancariaId,
                        descripcion,
                        fecha,
                        monto: Number(monto),
                        referencia,
                        usuario_crea,
                        estadoId: 1
                    };
                    let result = await CuentaBancariaTransaccion.create(infoT, { transaction });
                    if (result) {
                        response.code = 1;
                        response.data = result;
                    } else {
                        response.code = -1;
                        response.data = "Ocurrió un error al intentar registrar la transacción de débito"
                    }
                }
            }

        } else if (Number(monto) > 0) {
            let infoT = {
                partida_contableId,
                cuenta_bancariaId,
                descripcion,
                fecha,
                monto: Number(monto),
                referencia,
                usuario_crea,
                estadoId: 1
            };
            let result = await CuentaBancariaTransaccion.create(infoT, { transaction });
            if (result) {
                response.code = 1;
                response.data = result;
            } else {
                response.code = -1;
                response.data = "Ocurrió un error al intentar registrar la transacción de débito"
            }
        } else {
            response.code = -1;
            response.data = "El monto de la transacción no puede ser 0";
        }
    } else {
        response.code = -1;
        response.data = "Ocurrió un error al consultar la cuenta en la base de datos por favor verifique";
    }
    return response;
}
module.exports = {
    Registrar
}