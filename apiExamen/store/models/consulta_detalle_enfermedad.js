module.exports = (sequelize, type) => {
    return sequelize.define(
        "consulta_detalle_enfermedad",
        {
            seridalId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            consultaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "consulta",
                    key: "consultaId",
                }
            },
            enfermedadId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_enfermedad",
                    key: "enfermedadId",
                }
            },
            fecha_crea: {
                type: type.DATE,
                allowNull: false,
                defaultValue: type.NOW
            },
            fecha_ult_mod: {
                type: type.DATE
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
        }
    );
};
