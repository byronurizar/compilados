module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_empresa",
        {
            empresaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            certificadorId: {
                type: type.INTEGER,
                references: {
                    model: "cat_certificador",
                    key: "certificadorId",
                }
            },
            razon_social: {
                type: type.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            nombre_comercial: {
                type: type.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            nit: {
                type: type.STRING(20),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true
                }
            },
            giro_comercial: {
                type: type.STRING(300),
            },
            email: {
                type: type.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    isEmail: true
                }
            },
            afiliacion_iva: {
                type: type.STRING(50),
                allowNull: false,
            },
            codigo_moneda: {
                type: type.STRING(10),
                allowNull: false,
            },
            codigo_escenario: {
                type: type.STRING(10),
                allowNull: false,
            },
            codigo_frase: {
                type: type.STRING(10),
                allowNull: false,
            },
            codigo_establecimiento: {
                type: type.STRING(10),
                allowNull: false,
            },
            codigo_pais: {
                type: type.STRING(10),
                allowNull: false,
            },
            departamento: {
                type: type.STRING(60),
                allowNull: false,
            },
            municipio: {
                type: type.STRING(60),
                allowNull: false,
            },
            direccion: {
                type: type.STRING(300),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            codigo_postal: {
                type: type.STRING(10),
                allowNull: false,
            },
            logo: {
                type: type.BLOB('long'),
                allowNull: true
            },
            nota_pie_factura:{
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
