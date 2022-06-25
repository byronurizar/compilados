module.exports = (sequelize, type) => {
    return sequelize.define(
        "informacion_pago_detalle",
        {
            informacion_pago_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            informacion_pagoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "informacion_pago",
                    key: "informacion_pagoId",
                }
            },
            serie: {
                type: type.STRING(100),
                allowNull: true
            },
            numero: {
                type: type.STRING(300),
                allowNull: true
            },
            fecha: {
                type: type.DATE,
                allowNull: true
            },
            emisor: {
                type: type.STRING(300),
                allowNull: true
            },
            emisor_nit: {
                type: type.STRING(300),
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
