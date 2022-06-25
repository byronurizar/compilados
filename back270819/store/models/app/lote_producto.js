module.exports = (sequelize, type) => {
    return sequelize.define(
        "lote_producto",
        {
            lote_productoId: {
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
            sucursalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_sucursal",
                    key: "sucursalId",
                }
            },
            descripcion: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            fecha_vencimiento: {
                type: type.DATE,
                allowNull: false,
            },
            cantidad_inicial: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notEmpty: true
                }
            },
            disponible: {
                type: type.DECIMAL(10, 2),
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
