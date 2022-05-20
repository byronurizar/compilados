module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_presupuesto",
        {
            presupuestoId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            grupo_gastoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_grupo_gasto",
                    key: "grupo_gastoId",
                }
            },
            anio: {
                type: type.INTEGER,
                allowNull: false
            }, 
            mesId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_mes",
                    key: "mesId",
                }
            },
            fecha_presupuesto:{
                type: type.DATE,
            },
            descripcion: {
                type: type.STRING(200),
                allowNull: false,
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
