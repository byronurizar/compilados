module.exports = (sequelize, type) => {
    return sequelize.define(
        "porcentaje_impuesto_regimen_fiscal",
        {
            serialId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            regimen_fiscalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_regimen_fiscal",
                    key: "regimen_fiscalId",
                }
            },
            tipo_impuestoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_impuesto",
                    key: "tipo_impuestoId",
                }
            },
            porcentaje: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            }, monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notEmpty: true
                }
            },
            orden: {
                type: type.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notEmpty: true
                }
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
