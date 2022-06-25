module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_bodega",
        {
            bodegaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            sucursalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_sucursal",
                    key: "sucursalId",
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
            municipioId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_municipio",
                    key: "municipioId",
                }
            },
            direccion: {
                type: type.STRING(300),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            puntoReferencia: {
                type: type.STRING(300)
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
