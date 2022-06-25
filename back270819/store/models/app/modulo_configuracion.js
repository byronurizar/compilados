module.exports = (sequelize, type) => {
    return sequelize.define(
        "modulo_configuracion",
        {
            modulo_configuracionId: {
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
            moduloId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_modulo_sistema",
                    key: "moduloId",
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
