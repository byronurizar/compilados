module.exports = (sequelize, type) => {
    return sequelize.define(
        "presupuesto_detalle",
        {
            presupuesto_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            presupuestoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_presupuesto",
                    key: "presupuestoId",
                }
            },
            categoriaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_categoria_grupo_gasto",
                    key: "categoriaId",
                }
            },
            monto: {
                type: type.DECIMAL(10, 2),
                allowNull: false,
                defaultValue:0,
                validate: {
                    notEmpty: true
                }
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
