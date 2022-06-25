module.exports = (sequelize, type) => {
    return sequelize.define(
        "media_detalle",
        {
            media_detalleId: {
                type: type.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            mediaId: {
                type: type.INTEGER,
                allowNull: false,
                references: {
                    model: "media",
                    key: "mediaId",
                }
            },
            nombre:{
                type:type.STRING(200),
                allowNull:false
            },
            mimetype:{
                type:type.STRING(100),
                allowNull:false
            },
            blob: {
                type: type.BLOB('long'),
                allowNull: false
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
