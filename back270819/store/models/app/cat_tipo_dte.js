module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_tipo_dte",
        {
            tipo_dteId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            codigo: {
                type: type.STRING(10),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            descripcion: {
                type: type.STRING(200),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
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
