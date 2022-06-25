module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_cuenta_contable",
        {
            cuenta_contableId: {
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
            codigo: {
                type: type.STRING(100),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            nombre: {
                type: type.STRING(200),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            saldo: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    notEmpty: true
                }
            },
            saldo_negativo: {
                type: type.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                validate: {
                    notEmpty: true
                }
            },
            grupo_contableId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_grupo_contable",
                    key: "grupo_contableId",
                }
            },
            tipo_contraparteId:{
                type: type.INTEGER,
                allowNull: true,
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
