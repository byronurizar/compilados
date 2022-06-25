module.exports = (sequelize, type) => {
    return sequelize.define(
        "producto_tipo_presentacion",
        {
            producto_tipo_presentacionId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            unidades: {
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
            precio_venta: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            default_compra: {
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                validate: {
                    notEmpty: true
                }
            },
            default_venta: {
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
