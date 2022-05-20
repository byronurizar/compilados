module.exports = (sequelize, type) => {
    const Rol = sequelize.define(
        "cat_perfil_grupo_gasto",
        {
            perfilId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            grupo_gastoId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "cat_grupo_gasto",
                    key: "grupo_gastoId",
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
