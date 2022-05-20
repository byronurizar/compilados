module.exports = (sequelize, type) => {
    return sequelize.define(
        "grupo_gasto_usuario",
        {
            grupo_gasto_usuarioId: {
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
            usuarioId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "usuario",
                    key: "usuarioId",
                }
            },
            monedaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_moneda",
                    key: "monedaId",
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
