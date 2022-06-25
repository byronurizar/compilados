module.exports = (sequelize, type) => {
    return sequelize.define(
        "encuesta_comercio_producto",
        {
            encuesta_comercio_productoId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            encuesta_comercioId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "encuesta_comercio",
                    key: "encuesta_comercioId",
                }
            },
            encuesta_productoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "encuesta_producto",
                    key: "encuesta_productoId",
                }
            },
            precio: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            cantidad_mayorista: {
                type: type.INTEGER,
            },
            precio_mayorista: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            observaciones: {
                type: type.STRING(300),
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
