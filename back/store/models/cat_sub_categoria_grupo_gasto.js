module.exports = (sequelize, type) => {
    const Rol = sequelize.define(
        "cat_sub_categoria_grupo_gasto",
        {
            sub_categoriaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            categoriaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_categoria_grupo_gasto",
                    key: "categoriaId",
                }
            },
            nombre: {
                type: type.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
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
    return Rol;
};
