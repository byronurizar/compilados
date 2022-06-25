module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_tipo_presentacion",
        {
            tipo_presentacionId: {
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
            nombre: {
                type: type.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            descripcion: {
                type: type.STRING(300),
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
