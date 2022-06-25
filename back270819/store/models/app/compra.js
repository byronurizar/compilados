module.exports = (sequelize, type) => {
    return sequelize.define(
        "compra",
        {
            compraId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sucursalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_sucursal",
                    key: "sucursalId",
                }
            },
            proveedorId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_proveedor",
                    key: "proveedorId",
                }
            },
            tipo_pagoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_pago",
                    key: "tipo_pagoId",
                }
            },
            tipo_dteId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_dte",
                    key: "tipo_dteId",
                }
            },
            monto_excento_iva: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue:0,
                validate: {
                    notEmpty: true
                }
            },
            recargo_descuento: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue:0,
                validate: {
                    notEmpty: true
                }
            },
            observaciones: {
                type: type.STRING(500),
            },
            mediaId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "media",
                    key: "mediaId",
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
