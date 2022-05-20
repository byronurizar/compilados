module.exports = (sequelize, type) => {
    return sequelize.define(
        "invitacion_grupo_gasto",
        {
            codigo: {
                type: type.STRING(300),
                primaryKey: true,
            },
            grupo_gastoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_grupo_gasto",
                    key: "grupo_gastoId",
                }
            },
            messageId: {
                type: type.STRING(300)
            },
            emisor: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            receptor: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            nombre1: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            apellido1: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            generoId: {
                type: type.INTEGER,
                allowNull: false,
            },
            usuarioId: {
                type: type.INTEGER
            },
            fecha_crea: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            fecha_vencimiento: {
                type: type.DATE,
                allowNull: false
            },
            ip_solicitud: {
                type: type.STRING(100)
            },
            fecha_update: {
                type: type.DATE,
                allowNull: true
            },
            ip_update: {
                type: type.STRING(100)
            },
            estadoId: {
                type: type.INTEGER,
                allowNull: false,
                defaultValue: 2,
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
