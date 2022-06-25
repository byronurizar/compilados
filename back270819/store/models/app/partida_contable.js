module.exports = (sequelize, type) => {
    return sequelize.define(
        "partida_contable",
        {
            partida_contableId: {
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
            periodo_contableId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_periodo_contable",
                    key: "periodo_contableId",
                }
            },
            numero_partida: {
                type: type.INTEGER,
                allowNull: false
            },
            observaciones: {
                type: type.STRING(500),
            },
            fecha: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
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
