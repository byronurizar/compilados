module.exports = (sequelize, type) => {
    return sequelize.define(
        "contraparte_detalle",
        {
            contraparte_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            contraparteId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "contraparte",
                    key: "contraparteId",
                }
            },
            llaveId: {
                type: type.INTEGER,
                allowNull: false
            },
            monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
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
