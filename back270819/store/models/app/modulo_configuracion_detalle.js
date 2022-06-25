module.exports = (sequelize, type) => {
    return sequelize.define(
        "modulo_configuracion_detalle",
        {
            serialId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            modulo_configuracionId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "modulo_configuracion",
                    key: "modulo_configuracionId",
                }
            },
            config_parametroId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_parametro_configuracion",
                    key: "config_parametroId",
                }
            },
            valor: {
                type: type.STRING(500),
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
