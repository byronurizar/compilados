module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_grupo_contable",
        {
            grupo_contableId: {
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
            codigo: {
                type: type.STRING(100),
                allowNull: false,
                // unique: true,
                validate: {
                    notEmpty: true
                }
            },
            descripcion: {
                type: type.STRING(200)
            },
            padre_grupo_contableId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "cat_grupo_contable",
                    key: "grupo_contableId",
                }
            },
            cargo_abono: {
                type: type.INTEGER,
                allowNull: false,
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
