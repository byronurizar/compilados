module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_producto",
        {
            productoId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            empresaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_empresa",
                    key: "empresaId",
                }
            },
            categoriaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_categoria",
                    key: "categoriaId",
                }
            },
            tipo_productoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_producto",
                    key: "tipo_productoId",
                }
            },
            codigo: {
                type: type.STRING(300),
                allowNull: false,
                // unique: true,
                validate: {
                    notEmpty: true
                }
            },
            nombre: {
                type: type.STRING(300),
                allowNull: false,
                // unique: true,
                validate: {
                    notEmpty: true
                }
            },
            descripcion: {
                type: type.STRING(600),
            },
            precio: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            costo: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            puede_ser_vendido:{
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    notEmpty: true
                }
            },
            puede_ser_comprado:{
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    notEmpty: true
                }
            },
            perecedero:{
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    notEmpty: false
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
