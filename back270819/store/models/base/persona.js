module.exports = (sequelize, type) => {
    return sequelize.define(
        "persona",
        {
            personaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
              empresaId: {
                type: type.INTEGER,
                allowNull: false,
                // references: {
                //     model: "cat_empresa",
                //     key: "empresaId",
                // }
            },
            es_empleado: {
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            nombre1: {
                type: type.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            nombre2: {
                type: type.STRING(50)
            },
            nombre_otros: {
                type: type.STRING(50)
            },
            apellido1: {
                type: type.STRING(50),
            },
            apellido2: {
                type: type.STRING(50)
            },
            apellido_casada: {
                type: type.STRING(50)
            },
            fecha_nacimiento: {
                type: type.DATE,
                allowNull: true
            },
            generoId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "cat_genero",
                    key: "generoId",
                }
            },
            email: {
                type: type.STRING(150),
                allowNull: true
            },
            usuario_crea: {
                type: type.INTEGER
            },
            fecha_crea: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            usuario_ult_mod: {
                type: type.INTEGER
            },
            fecha_ult_mod: {
                type: type.DATE
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
