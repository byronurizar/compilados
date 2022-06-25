module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_certificador",
        {
            certificadorId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: type.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            nit: {
                type: type.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            username: {
                type: type.STRING(50),
            },
            password: {
                type: type.STRING(200),
            },
            grant_type: {
                type: type.STRING(50),
            },
            endpoint_get_token: {
                type: type.STRING(200),
            },
            token: {
                type: type.STRING(1000),
            },
            fecha_emision_token: {
                type: type.DATE,
            },
            fecha_expiracion_token: {
                type: type.DATE,
            },
            endpoint_certifica_dte: {
                type: type.STRING(200),
            },
            endpoint_anula_dte: {
                type: type.STRING(200),
            },
            endpoint_consulta_nit: {
                type: type.STRING(200),
            },
            endpoint_consulta_dte: {
                type: type.STRING(200),
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
