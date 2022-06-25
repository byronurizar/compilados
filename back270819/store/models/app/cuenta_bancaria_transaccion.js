module.exports = (sequelize, type) => {
    return sequelize.define(
        "cuenta_bancaria_transaccion",
        {
            serialId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            partida_contableId: {
                type: type.INTEGER,
                allowNull: true,
                references: {
                    model: "partida_contable",
                    key: "partida_contableId",
                }
            },
            cuenta_bancariaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_cuenta_bancaria",
                    key: "cuenta_bancariaId",
                }
            },
            descripcion: {
                type: type.STRING(300),
            },
            fecha: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            referencia: {
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
