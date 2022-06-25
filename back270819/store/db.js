const Sequelize = require('sequelize');
const config = require('../config');
const { QueryTypes } = require('sequelize');


const confiBd = new Sequelize(
  config.bd.database,
  config.bd.username,
  config.bd.password,
  {
    host: config.bd.host,
    dialect: config.bd.dialect,
    port: config.bd.port,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    logging: false, //Evitamos que nos muestre lo que hace con la bd
    timezone: "-06:00",
  }
);

//Inicio Modelos de Sistema Base
const EstadoModel = require('./models/base/cat_estado');
const GeneroModel = require('./models/base/cat_genero');
const TipoSangreModel = require('./models/base/cat_tipo_sangre');
const EstadoCivilModel = require('./models/base/cat_estado_civil');
const TipoDocumentoModel = require('./models/base/cat_tipo_documento');
const TipoTelefonoModel = require('./models/base/cat_tipo_telefono');
const PaisModel = require('./models/base/cat_pais');
const DepartamentoModel = require('./models/base/cat_departamento');
const MunicipioModel = require('./models/base/cat_municipio');
const AccesoModel = require('./models/base/cat_acceso');
const MenuModel = require('./models/base/cat_menu');
const RolModel = require('./models/base/cat_rol');
const MenuAccesoModel = require('./models/base/menu_acceso');
const RolMenuAccesoModel = require('./models/base/rol_menu_acceso');
const BitacoraCambiosModel = require('./models/base/bitacora_cambios');
const BitacoraPeticionModel = require('./models/base/bitacora_peticion');
const PersonaModel = require('./models/base/persona');
const IdentificacionPersonaModel = require('./models/base/identificacion_persona');
const DireccionPersonaModel = require('./models/base/direccion_persona');
const DatoExtraPersonaModel = require('./models/base/dato_extra_persona');
const UsuarioModel = require('./models/base/usuario');
const UsuarioRolModel = require('./models/base/usuario_rol');
const FotoUsuarioModel = require('./models/base/foto_usuario');
const TelefonoPersonaModel = require('./models/base/telefono_persona');
const ResetPassWordModel = require('./models/base/reset_password');
const ParametroModel = require('./models/base/cat_parametro');
//Fin Modelos de Sistema Base

const CategoriaModel = require('./models/app/cat_categoria');
const ProveedorModel = require('./models/app/cat_proveedor');
const ContactoProveedorModel = require('./models/app/cat_contacto_proveedor');
const TelefonoContactoProveedorModel = require('./models/app/cat_telefono_contacto_proveedor');
const SucursalModel = require('./models/app/cat_sucursal');
const BodegaModel = require('./models/app/cat_bodega');
const ProductoModel = require('./models/app/cat_producto');
const LoteProductoModel = require('./models/app/lote_producto');
const StockModel = require('./models/app/stock');
const GrupoContableModel = require('./models/app/cat_grupo_contable');
const CuentaContableModel = require('./models/app/cat_cuenta_contable');
const PeriodoContableModel = require('./models/app/cat_periodo_contable');
const PartidaContableModel = require('./models/app/partida_contable');
const TipoContraParteModel = require('./models/app/cat_tipo_contraparte');
const PartidaContableDetalleModel = require('./models/app/partida_contable_detalle');
const ContraParteModel = require('./models/app/contraparte');
const ContraParteDetalleModel = require('./models/app/contraparte_detalle');
const TipoComprobanteModel = require('./models/app/cat_tipo_comprobante');
const UsuarioSucursalModel = require('./models/app/usuario_sucursal');
const ControlComprobanteModel = require('./models/app/control_comprobante');
const ControlComprobanteDetalleModel = require('./models/app/control_comprobante_detalle');
const TipoProductoModel = require('./models/app/cat_tipo_producto');
const CompraModel = require('./models/app/compra');
const CompraDetalleModel = require('./models/app/compra_detalle');
const InformacionPagoModel = require('./models/app/informacion_pago');
const InformacionPagoDetalleModel = require('./models/app/informacion_pago_detalle');
const TipoDTEModel = require('./models/app/cat_tipo_dte');
const TipoImpuestoModel = require('./models/app/cat_tipo_impuesto');
const RegimenFiscalModel = require('./models/app/cat_regimen_fiscal');
const PorcentajeInpuestoRegimenFiscalModel = require('./models/app/porcentaje_impuesto_regimen_fiscal');
const CertificadorModel=require('./models/app/cat_certificador');
const EmpresaModel = require('./models/app/cat_empresa');
const EmpresaRegimenFiscalModel = require('./models/app/empresa_regimen_fiscal');
const CuentaBancariaModel = require('./models/app/cat_cuenta_bancaria');
const CuentaBancariaTransaccionModel = require('./models/app/cuenta_bancaria_transaccion');
const ParametroConfiguracionMode = require('./models/app/cat_parametro_configuracion');
const ModuloSistemaModel = require('./models/app/cat_modulo_sistema');
const ModuloSistemaConfiguracionModel = require('./models/app/modulo_configuracion');
const ModuloSistemaConfiguracionDetalleModel = require('./models/app/modulo_configuracion_detalle');
const TipoPagoModel = require('./models/app/cat_tipo_pago');
const MediaModel = require('./models/app/media');
const MediaDetalleModel = require('./models/app/media_detalle');
const TipoPresentacionModel = require('./models/app/cat_tipo_presentacion');
const ProductoTipoPresentacionModel = require('./models/app/producto_tipo_presentacion');
const FacturaModel = require('./models/app/factura');
const FacturaDetalleModel = require('./models/app/factura_detalle');



//Inicio Se realizo para encuesta
const EncuestaComercioModel = require('./models/app/encuesta_comercio');
const EncuestaProductoModel = require('./models/app/encuesta_producto');
const EncuestaComercioProductoModel = require('./models/app/encuesta_comercio_producto');
const EncuestaComercio = EncuestaComercioModel(confiBd, Sequelize);
const EncuestaProducto = EncuestaProductoModel(confiBd, Sequelize);
const EncuestaComercioProducto = EncuestaComercioProductoModel(confiBd, Sequelize);
//Fin Se realizo para encuesta
//Inicio Modelos de Sistema Base
const Estado = EstadoModel(confiBd, Sequelize);
const Genero = GeneroModel(confiBd, Sequelize);
const TipoSangre = TipoSangreModel(confiBd, Sequelize);
const EstadoCivil = EstadoCivilModel(confiBd, Sequelize);
const TipoDocumento = TipoDocumentoModel(confiBd, Sequelize);
const TipoTelefono = TipoTelefonoModel(confiBd, Sequelize);
const Pais = PaisModel(confiBd, Sequelize);
const Departamento = DepartamentoModel(confiBd, Sequelize);
const Municipio = MunicipioModel(confiBd, Sequelize);
const Acceso = AccesoModel(confiBd, Sequelize);
const Menu = MenuModel(confiBd, Sequelize);
const Rol = RolModel(confiBd, Sequelize);
const MenuAcceso = MenuAccesoModel(confiBd, Sequelize);
const RolMenuAcceso = RolMenuAccesoModel(confiBd, Sequelize);
const BitacoraCambios = BitacoraCambiosModel(confiBd, Sequelize);
const BitacoraPeticion = BitacoraPeticionModel(confiBd, Sequelize);
const Certificador=CertificadorModel(confiBd, Sequelize);
const Empresa = EmpresaModel(confiBd, Sequelize);
const Persona = PersonaModel(confiBd, Sequelize);
const IdentificacionPersona = IdentificacionPersonaModel(confiBd, Sequelize);
const DireccionPersona = DireccionPersonaModel(confiBd, Sequelize);
const DatoExtraPersona = DatoExtraPersonaModel(confiBd, Sequelize);
const Usuario = UsuarioModel(confiBd, Sequelize);
const UsuarioRol = UsuarioRolModel(confiBd, Sequelize);
const FotoUsuario = FotoUsuarioModel(confiBd, Sequelize);
const TelefonoPersona = TelefonoPersonaModel(confiBd, Sequelize);
const ResetPassWord = ResetPassWordModel(confiBd, Sequelize);
const Parametro = ParametroModel(confiBd, Sequelize);
const TipoComprobante = TipoComprobanteModel(confiBd, Sequelize);
//Fin Modelos de Sistema Base

const Categoria = CategoriaModel(confiBd, Sequelize);
const Proveedor = ProveedorModel(confiBd, Sequelize);
const ContactoProveedor = ContactoProveedorModel(confiBd, Sequelize);
const TelefonoContactoProveedor = TelefonoContactoProveedorModel(confiBd, Sequelize);
const Sucursal = SucursalModel(confiBd, Sequelize);
const Bodega = BodegaModel(confiBd, Sequelize);
const TipoProducto = TipoProductoModel(confiBd, Sequelize);
const Producto = ProductoModel(confiBd, Sequelize);
const Stock = StockModel(confiBd, Sequelize);
const LoteProducto = LoteProductoModel(confiBd, Sequelize);
const GrupoContable = GrupoContableModel(confiBd, Sequelize);
const CuentaContable = CuentaContableModel(confiBd, Sequelize);
const PeriodoContable = PeriodoContableModel(confiBd, Sequelize);
const PartidaContable = PartidaContableModel(confiBd, Sequelize);
const TipoContraParte = TipoContraParteModel(confiBd, Sequelize);
const PartidaContableDetalle = PartidaContableDetalleModel(confiBd, Sequelize);
const ContraParte = ContraParteModel(confiBd, Sequelize);
const ContraParteDetalle = ContraParteDetalleModel(confiBd, Sequelize);
const UsuarioSucursal = UsuarioSucursalModel(confiBd, Sequelize);
const TipoImpuesto = TipoImpuestoModel(confiBd, Sequelize);
const RegimenFiscal = RegimenFiscalModel(confiBd, Sequelize);
const PorcentajeInpuestoRegimenFiscal = PorcentajeInpuestoRegimenFiscalModel(confiBd, Sequelize);
//const ControlComprobante = ControlComprobanteModel(confiBd, Sequelize);
//const ControlComprobanteDetalle = ControlComprobanteDetalleModel(confiBd, Sequelize);
const Compra = CompraModel(confiBd, Sequelize);
const CompraDetalle = CompraDetalleModel(confiBd, Sequelize);
const InformacionPago = InformacionPagoModel(confiBd, Sequelize);
const InformacionPagoDetalle = InformacionPagoDetalleModel(confiBd, Sequelize);
const TipoDTE = TipoDTEModel(confiBd, Sequelize);

const EmpresaRegimenFiscal = EmpresaRegimenFiscalModel(confiBd, Sequelize);
const CuentaBancaria = CuentaBancariaModel(confiBd, Sequelize);
const CuentaBancariaTransaccion = CuentaBancariaTransaccionModel(confiBd, Sequelize);

const ParametroConfiguracio = ParametroConfiguracionMode(confiBd, Sequelize);
const ModuloSistema = ModuloSistemaModel(confiBd, Sequelize);
const ModuloSistemaConfiguracion = ModuloSistemaConfiguracionModel(confiBd, Sequelize);
const ModuloSistemaConfiguracionDetalle = ModuloSistemaConfiguracionDetalleModel(confiBd, Sequelize);
const TipoPago = TipoPagoModel(confiBd, Sequelize);
const TipoPresentacion = TipoPresentacionModel(confiBd, Sequelize);
const ProductoTipoPresentacion = ProductoTipoPresentacionModel(confiBd, Sequelize);
const Factura = FacturaModel(confiBd, Sequelize)
const FacturaDetalle = FacturaDetalleModel(confiBd, Sequelize);

const Media = MediaModel(confiBd, Sequelize);
const MediaDetalle = MediaDetalleModel(confiBd, Sequelize);



//Inicio de Relaciones de Sistema Base
EstadoCivil.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Pais.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Departamento.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Departamento.belongsTo(Pais, {
  as: "Pais",
  foreignKey: "paisId",
  onDelete: "CASCADE",
});

Municipio.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Municipio.belongsTo(Departamento, {
  as: "Departamento",
  foreignKey: "departamentoId",
  onDelete: "CASCADE",
});

TipoDocumento.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

TipoTelefono.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

TipoSangre.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Acceso.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Rol.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Persona.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Persona.belongsTo(Genero, {
  as: "Genero",
  foreignKey: "generoId",
  onDelete: "CASCADE",
});

Persona.hasMany(Usuario, {
  as: "Usuario",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

Persona.hasMany(IdentificacionPersona, {
  as: "IdentificacionPersona",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

Persona.hasMany(DireccionPersona, {
  as: "DireccionPersona",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

Persona.hasMany(TelefonoPersona, {
  as: "TelefonoPersona",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

Persona.hasMany(DatoExtraPersona, {
  as: "DatoExtraPersona",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

IdentificacionPersona.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

IdentificacionPersona.belongsTo(TipoDocumento, {
  as: "TipoDocumento",
  foreignKey: "tipo_documentoId",
  onDelete: "CASCADE",
});

TelefonoPersona.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

TelefonoPersona.belongsTo(TipoTelefono, {
  as: "TipoTelefono",
  foreignKey: "tipo_telefonoId",
  onDelete: "CASCADE",
});

DireccionPersona.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

DireccionPersona.belongsTo(Municipio, {
  as: "Municipio",
  foreignKey: "municipioId",
  onDelete: "CASCADE",
});

DatoExtraPersona.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

DatoExtraPersona.belongsTo(TipoSangre, {
  as: "TipoSangre",
  foreignKey: "tipo_sangreId",
  onDelete: "CASCADE",
});

DatoExtraPersona.belongsTo(EstadoCivil, {
  as: "EstadoCivil",
  foreignKey: "estado_civilId",
  onDelete: "CASCADE",
});

Usuario.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Usuario.belongsTo(Persona, {
  as: "Persona",
  foreignKey: "personaId",
  onDelete: "CASCADE",
});

UsuarioRol.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

UsuarioRol.belongsTo(Rol, {
  as: "Rol",
  foreignKey: "rolId",
  onDelete: "CASCADE",
});

UsuarioRol.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});

MenuAcceso.belongsTo(Menu, {
  as: "Menu",
  foreignKey: "menuId",
  onDelete: "CASCADE",
});

MenuAcceso.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

MenuAcceso.belongsTo(Acceso, {
  as: "Acceso",
  foreignKey: "accesoId",
  onDelete: "CASCADE",
});

RolMenuAcceso.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

RolMenuAcceso.belongsTo(MenuAcceso, {
  as: "MenuAcceso",
  foreignKey: "menu_accesoId",
  onDelete: "CASCADE",
});

Menu.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Menu.belongsTo(Menu, {
  as: "MenuPadre",
  foreignKey: "menu_padreId",
  onDelete: "CASCADE",
});

BitacoraCambios.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuario_crea",
  onDelete: "CASCADE",
});

BitacoraPeticion.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuario_crea",
  onDelete: "CASCADE",
});

//Fin de Relaciones de Sistema Base

Categoria.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Proveedor.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Proveedor.belongsTo(Municipio, {
  as: "Municipio",
  foreignKey: "municipioId",
  onDelete: "CASCADE",
});

ContactoProveedor.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

TelefonoContactoProveedor.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

ContactoProveedor.hasMany(TelefonoContactoProveedor, {
  as: "Telefonos",
  foreignKey: "contacto_proveedorId",
  onDelete: "CASCADE",
});


TelefonoContactoProveedor.belongsTo(TipoTelefono, {
  as: "TipoTelefono",
  foreignKey: "tipo_telefonoId",
  onDelete: "CASCADE",
});

Sucursal.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Sucursal.belongsTo(Municipio, {
  as: "Municipio",
  foreignKey: "municipioId",
  onDelete: "CASCADE",
});

Bodega.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Bodega.belongsTo(Municipio, {
  as: "Municipio",
  foreignKey: "municipioId",
  onDelete: "CASCADE",
});


Bodega.belongsTo(Sucursal, {
  as: "Sucursal",
  foreignKey: "sucursalId",
  onDelete: "CASCADE",
});

TipoProducto.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Producto.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Producto.belongsTo(Categoria, {
  as: "Categoria",
  foreignKey: "categoriaId",
  onDelete: "CASCADE",
});
Producto.belongsTo(TipoProducto, {
  as: "TipoProducto",
  foreignKey: "tipo_productoId",
  onDelete: "CASCADE",
});

Stock.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Stock.belongsTo(Sucursal, {
  as: "Sucursal",
  foreignKey: "sucursalId",
  onDelete: "CASCADE",
});

LoteProducto.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});
LoteProducto.belongsTo(Sucursal, {
  as: "Sucursal",
  foreignKey: "sucursalId",
  onDelete: "CASCADE",
});


GrupoContable.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

GrupoContable.belongsTo(GrupoContable, {
  as: "GrupoPadre",
  foreignKey: "padre_grupo_contableId",
  onDelete: "CASCADE",
});

CuentaContable.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

CuentaContable.belongsTo(GrupoContable, {
  as: "GrupoContable",
  foreignKey: "grupo_contableId",
  onDelete: "CASCADE",
});

PeriodoContable.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

TipoComprobante.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

PartidaContable.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

PartidaContable.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuario_crea",
  onDelete: "CASCADE",
});

PartidaContable.belongsTo(PeriodoContable, {
  as: "Periodo",
  foreignKey: "periodo_contableId",
  onDelete: "CASCADE",
});

PartidaContable.hasMany(PartidaContableDetalle, {
  as: "Detalle",
  foreignKey: "partida_contableId",
  onDelete: "CASCADE",
});


PartidaContableDetalle.belongsTo(CuentaContable, {
  as: "Cuenta",
  foreignKey: "cuenta_contableId",
  onDelete: "CASCADE",
});

UsuarioSucursal.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

UsuarioSucursal.belongsTo(Sucursal, {
  as: "Sucursal",
  foreignKey: "sucursalId",
  onDelete: "CASCADE",
});

UsuarioSucursal.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
});


CuentaBancaria.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

CuentaBancaria.hasMany(CuentaBancariaTransaccion, {
  as: "Transacciones",
  foreignKey: "cuenta_bancariaId",
  onDelete: "CASCADE",
});

CuentaBancariaTransaccion.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

Compra.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuario_crea",
  onDelete: "CASCADE",
});

Compra.belongsTo(Sucursal, {
  as: "Sucursal",
  foreignKey: "sucursalId",
  onDelete: "CASCADE",
});

Compra.belongsTo(Proveedor, {
  as: "Proveedor",
  foreignKey: "proveedorId",
  onDelete: "CASCADE",
});

Compra.belongsTo(TipoPago, {
  as: "TipoPago",
  foreignKey: "tipo_pagoId",
  onDelete: "CASCADE",
});

Compra.belongsTo(TipoDTE, {
  as: "TipoDTE",
  foreignKey: "tipo_dteId",
  onDelete: "CASCADE",
});

Compra.hasMany(CompraDetalle, {
  as: "Detalle",
  foreignKey: "compraId",
  onDelete: "CASCADE",
});

CompraDetalle.belongsTo(Producto, {
  as: "Producto",
  foreignKey: "productoId",
  onDelete: "CASCADE",
});


TipoPresentacion.belongsTo(Estado, {
  as: "Estado",
  foreignKey: "estadoId",
  onDelete: "CASCADE",
});

// ControlComprobanteDetalle.belongsTo(TipoComprobante, {
//   as: "Tipo",
//   foreignKey: "tipo_comprobanteId",
//   onDelete: "CASCADE",
// });

Producto.hasMany(ProductoTipoPresentacion, {
  as: "TipoPresentacion",
  foreignKey: "productoId",
  onDelete: "CASCADE",
});

ProductoTipoPresentacion.belongsTo(TipoPresentacion, {
  as: "TipoPresentacion",
  foreignKey: "tipo_presentacionId",
  onDelete: "CASCADE",
});

EncuestaComercio.belongsTo(Municipio, {
  as: "Municipio",
  foreignKey: "municipioId",
  onDelete: "CASCADE",
});


try {
  confiBd.sync({
    force: false,
  }).then(() => {
    const { Estados, Generos, Personas, Usuarios, Paises, Departamentos, Municipios, Menus, Accesos, MenuAccesos, TiposDocumentos, Roles, MenuAccesosRol, TiposTelefonos, EstadosCiviles, TiposSangre, UsuarioRoles, Parametros, ListGrupoContable, ListCuentaContable, ListTipoContraparte, ListTipoProducto, listProductos, listCategorias, listProveedores, listStock, listSucursal, listComercioProducto, listTipoDTE, listTipoImpuesto, listRegimenFiscal, listPorcentajeImpuestoRegimen, listEmpresa, listEmpresaRegimenFiscal, listCuentaBancaria, listModuloSistema, listParametroConfiguracion, listTipoPago, listModuloConfiguracion, listModuloConfiguracionDetalle, listTipoPresentacionProducto, listCertificador, listDireccionPersona, listIdentificacionPersona } = require('./data');

    confiBd.query("select count(*) as total from cat_estado", {
      type: QueryTypes.SELECT
    }).then(async (resultado) => {
      if (resultado[0].total === 1000) {
        //Inicio de Carga Inicial Sistema Base
        await Estado.bulkCreate(Estados);
        await Genero.bulkCreate(Generos);
        await Persona.bulkCreate(Personas);
        await Usuario.bulkCreate(Usuarios);
        await Pais.bulkCreate(Paises);
        await Departamento.bulkCreate(Departamentos);
        await Municipio.bulkCreate(Municipios);
        await Menu.bulkCreate(Menus);
        await Acceso.bulkCreate(Accesos);
        await Empresa.bulkCreate(listEmpresa);
        await MenuAcceso.bulkCreate(MenuAccesos)
        await TipoDocumento.bulkCreate(TiposDocumentos);
        await Rol.bulkCreate(Roles);
        await RolMenuAcceso.bulkCreate(MenuAccesosRol);
        await TipoTelefono.bulkCreate(TiposTelefonos);
        await EstadoCivil.bulkCreate(EstadosCiviles);
        await TipoSangre.bulkCreate(TiposSangre);
        await UsuarioRol.bulkCreate(UsuarioRoles);
        await Parametro.bulkCreate(Parametros);

        //Fin de Carga Inicial Sistema Base

        await Sucursal.bulkCreate(listSucursal);
        await TipoContraParte.bulkCreate(ListTipoContraparte);
        await GrupoContable.bulkCreate(ListGrupoContable);
        await CuentaContable.bulkCreate(ListCuentaContable);
        await TipoProducto.bulkCreate(ListTipoProducto);
        await Categoria.bulkCreate(listCategorias);
        await Proveedor.bulkCreate(listProveedores);
        await Producto.bulkCreate(listProductos);
        await Stock.bulkCreate(listStock);
        await TipoDTE.bulkCreate(listTipoDTE);
        await TipoImpuesto.bulkCreate(listTipoImpuesto);
        await RegimenFiscal.bulkCreate(listRegimenFiscal);
        await PorcentajeInpuestoRegimenFiscal.bulkCreate(listPorcentajeImpuestoRegimen);
        await EmpresaRegimenFiscal.bulkCreate(listEmpresaRegimenFiscal);
        await CuentaBancaria.bulkCreate(listCuentaBancaria);
        await ModuloSistema.bulkCreate(listModuloSistema);
        await ParametroConfiguracio.bulkCreate(listParametroConfiguracion);
        await TipoPago.bulkCreate(listTipoPago);
        await ModuloSistemaConfiguracion.bulkCreate(listModuloConfiguracion);
        await ModuloSistemaConfiguracionDetalle.bulkCreate(listModuloConfiguracionDetalle);
        await TipoPresentacion.bulkCreate(listTipoPresentacionProducto);
        await Certificador.bulkCreate(listCertificador);
        await DireccionPersona.bulkCreate(listDireccionPersona);
        await IdentificacionPersona.bulkCreate(listIdentificacionPersona);  
      }
    });
  });
} catch (e) {
  console.error(e);
}

module.exports = {
  Estado,
  Genero,
  TipoSangre,
  EstadoCivil,
  TipoDocumento,
  TipoTelefono,
  Pais,
  Departamento,
  Municipio,
  Acceso,
  Menu,
  Rol,
  MenuAcceso,
  RolMenuAcceso,
  BitacoraCambios,
  BitacoraPeticion,
  Persona,
  IdentificacionPersona,
  DireccionPersona,
  DatoExtraPersona,
  Usuario,
  UsuarioRol,
  FotoUsuario,
  TelefonoPersona,
  ResetPassWord,
  Parametro,
  bd: confiBd,
  Categoria,
  Proveedor,
  ContactoProveedor,
  TelefonoContactoProveedor,
  Sucursal,
  Bodega,
  TipoProducto,
  Producto,
  Stock,
  LoteProducto,
  GrupoContable,
  CuentaContable,
  PeriodoContable,
  PartidaContable,
  TipoContraParte,
  PartidaContableDetalle,
  ContraParte,
  ContraParteDetalle,
  TipoComprobante,
  UsuarioSucursal,
  // ControlComprobante,
  // ControlComprobanteDetalle,
  Compra,
  CompraDetalle,
  InformacionPago,
  InformacionPagoDetalle,

  //Inicio Se hizo para encuesta
  EncuestaComercio,
  EncuestaProducto,
  EncuestaComercioProducto,
  //Fin Se hizo para encuesta
  TipoDTE,
  TipoImpuesto,
  RegimenFiscal,
  PorcentajeInpuestoRegimenFiscal,
  Empresa,
  EmpresaRegimenFiscal,
  CuentaBancaria,
  CuentaBancariaTransaccion,
  ParametroConfiguracio,
  ModuloSistema,
  ModuloSistemaConfiguracion,
  ModuloSistemaConfiguracionDetalle,
  TipoPago,
  Media,
  MediaDetalle,
  TipoPresentacion,
  ProductoTipoPresentacion,
  Factura,
  FacturaDetalle,
  Certificador
}


