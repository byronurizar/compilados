module.exports = (sequelize, type) => {
    return sequelize.define(
        "contraparte",
        {
            contraparteId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            tipo_contraparteId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "cat_tipo_contraparte",
                    key: "tipo_contraparteId",
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
