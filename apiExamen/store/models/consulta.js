module.exports = (sequelize, type) => {
    return sequelize.define(
        "consulta",
        {
            consultaId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            doctorId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_doctor",
                    key: "doctorId",
                }
            },
            pacienteId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_paciente",
                    key: "pacienteId",
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
