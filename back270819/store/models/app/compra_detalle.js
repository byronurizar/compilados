module.exports = (sequelize, type) => {
    return sequelize.define(
        "compra_detalle",
        {
            compra_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            compraId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "compra",
                    key: "compraId",
                }
            },
            productoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_producto",
                    key: "productoId",
                }
            },
            tipo_presentacionId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_presentacion",
                    key: "tipo_presentacionId",
                }
            },
            cantidad: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            precio_compra: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            lote: {
                type: type.STRING(50),
            },
            fecha_vencimiento: {
                type: type.DATE,
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
