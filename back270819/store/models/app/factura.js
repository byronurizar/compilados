module.exports = (sequelize, type) => {
    return sequelize.define(
        "factura",
        {
            facturaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            empresaId: {
                type: type.INTEGER,
                references: {
                    model: "cat_empresa",
                    key: "empresaId",
                }
            },
            certificadorId: {
                type: type.INTEGER,
                references: {
                    model: "cat_certificador",
                    key: "certificadorId",
                }
            },
            sucursalId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_sucursal",
                    key: "sucursalId",
                }
            },
            personaId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "persona",
                    key: "personaId",
                }
            },
            tipo_pagoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_pago",
                    key: "tipo_pagoId",
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
			numero_autorizacion: {
                type: type.STRING(150),
                allowNull: true,
            },
            serie: {
                type: type.STRING(100),
                allowNull: true,
            },
            numeroDTE: {
                type: type.STRING(100),
                allowNull: true,
            },
            fecha_hora_certificacion: {
                type: type.DATE
            },
            cajaId: {
                type: type.INTEGER,
                allowNull: true,
            },
            observaciones: {
                type: type.STRING(500),
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
