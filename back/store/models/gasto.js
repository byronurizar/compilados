module.exports = (sequelize, type) => {
    return sequelize.define(
        "gasto",
        {
            gastoId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            grupo_gastoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_grupo_gasto",
                    key: "grupo_gastoId",
                }
            },
            categoriaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_categoria_grupo_gasto",
                    key: "categoriaId",
                }
            },
            sub_categoriaId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "cat_sub_categoria_grupo_gasto",
                    key: "sub_categoriaId",
                }
            },
            monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notEmpty: true
                }
            },
            descripcion: {
                type: type.STRING(100)
            },
            usuario_crea: {
                type: type.INTEGER
            },
            fecha_crea: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            usuario_ult_mod: {
                type: type.INTEGER
            },
            fecha_ult_mod: {
                type: type.DATE
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
