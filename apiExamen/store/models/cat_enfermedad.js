module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_enfermedad",
        {
            enfermedadId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            descripcion: {
                type: type.STRING(300),
                unique: true,
                allowNull: false,
                validate: {
                    notEmpty: true
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
