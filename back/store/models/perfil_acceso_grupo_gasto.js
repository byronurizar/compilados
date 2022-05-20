module.exports = (sequelize, type) => {
    return sequelize.define(
        "perfil_acceso_grupo_gasto",
        {
            serialId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            perfilId: {
                type: type.INTEGER,
                references: {
                    model: "cat_perfil_grupo_gasto",
                    key: "perfilId",
                }
            },
            accesoId: {
                type: type.INTEGER,
                references: {
                    model: "cat_acceso_grupo_gasto",
                    key: "accesoId",
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
};
