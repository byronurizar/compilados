module.exports = (sequelize, type) => {
    return sequelize.define(
        "empresa_regimen_fiscal",
        {
            serialId: {
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
            regimen_fiscalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_regimen_fiscal",
                    key: "regimen_fiscalId",
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
