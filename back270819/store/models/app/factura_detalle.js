module.exports = (sequelize, type) => {
    return sequelize.define(
        "factura_detalle",
        {
            factura_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            facturaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "factura",
                    key: "facturaId",
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
            },
            precio: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
            },
            descuento: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            impuesto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            sub_total: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
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
