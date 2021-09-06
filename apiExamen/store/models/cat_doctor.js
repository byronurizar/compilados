module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_doctor",
        {
            doctorId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombre: {
                type: type.STRING(200),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            direccion: {
                type: type.STRING(400),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            telefono: {
                type: type.STRING(30),
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
