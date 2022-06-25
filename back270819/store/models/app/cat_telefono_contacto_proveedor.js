module.exports = (sequelize, type) => {
    return sequelize.define(
        "cat_telefono_contacto_proveedor",
        {
            telefono_contacto_proveedorId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            contacto_proveedorId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_contacto_proveedor",
                    key: "contacto_proveedorId",
                }
            },
            tipo_telefonoId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "cat_tipo_telefono",
                    key: "tipo_telefonoId",
                }
            },
            telefono: {
                type: type.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
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
