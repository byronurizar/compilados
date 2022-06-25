module.exports = (sequelize, type) => {
    return sequelize.define(
        "control_comprobante_detalle",
        {
            control_comprobantedetalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            control_comprobanteId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "control_comprobante",
                    key: "control_comprobanteId",
                }
            },
            tipo_comprobanteId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_comprobante",
                    key: "tipo_comprobanteId",
                }
            },
            numero_cheque: {
                type: type.STRING(20),
                allowNull: true
            },
            fecha: {
                type: type.DATE,
                allowNull: true
            },
            banco: {
                type: type.STRING(300),
                allowNull: true
            },
            cuenta: {
                type: type.STRING(300),
                allowNull: true
            },
            pago_ala_orden_de: {
                type: type.STRING(300),
                allowNull: true
            },
            terminalId: {
                type: type.STRING(50),
                allowNull: true
            },
            autorizacion: {
                type: type.STRING(50),
                allowNull: true
            },
            referencia: {
                type: type.STRING(50),
                allowNull: true
            },
            fact: {
                type: type.STRING(50),
                allowNull: true
            },
            monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            imagen: {
                type: type.BLOB('long'),
                allowNull: true
            },
            usuario_crea: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "usuario",
                    key: "usuarioId",
                }
            },
            fecha_crea: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            usuario_ult_mod: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "usuario",
                    key: "usuarioId",
                }
            },
            fecha_ult_mod: {
                type: type.DATE,
                allowNull: true
            },
            estadoId: {
                type: type.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: "cat_estado",
                    key: "estadoId",
                }
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
};
