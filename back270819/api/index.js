const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const config = require('../config');
const errors = require('../network/errors');
const helmet = require('helmet');
const secret = 'secret';
require("../store/db");

//Inicio Rutas Base
const Estado = require('./base/estado/network');
const Municipio = require('./base/municipio/network');
const Pais = require('./base/pais/network');
const Departamento = require('./base/departamento/network');
const Genero = require('./base/genero/network');
const EstadoCivil = require('./base/estadocivil/network');
const TipoDocumento = require('./base/tipodocumento/network');
const TipoSangre = require('./base/tiposangre/network');
const TipoTelefono = require('./base/tipotelefono/network');
const Rol = require('./base/rol/network');
const Persona = require('./base/persona/network');
const DatoExtraPersona = require('./base/datoextrapersona/network');
const DireccionPersona = require('./base/direccionpersona/network');
const IdentificacionPersona = require('./base/identificacionpersona/network');
const TelefonoPersona = require('./base/telefonopersona/network');
const UsuarioRol = require('./base/usuariorol/network');
const Usuario = require('./base/usuario/network');
const Acceso = require('./base/acceso/network');
const Menu = require('./base/menu/network');
const MenuAcceso = require('./base/menuacceso/network');
const RolMenuAcceso = require('./base/rolmenuacceso/network');
const Auth = require('./base/auth/network');
const ResetPassword = require('./base/resetpassword/network');
const Bitacora = require('./base/bitacora/network');
const FotoUsuario = require('./base/fotousuario/network');
//Fin Rutas Base

const Catalogo = require('./app/catalogo/network');
const Proveedor = require('./app/proveedor/network');
const ContactoProveedor = require('./app/contactoproveedor/network');
const TelefonoContactoProveedor = require('./app/telefonocontactoproveedor/network');
const Categoria = require('./app/categoria/network');
const Sucursal = require('./app/sucursal/network');
const Bodega = require('./app/bodega/network');
const TipoProducto = require('./app/tipoproducto/network');
const Producto = require('./app/producto/network');
const LoteProducto = require('./app/loteproducto/network');
const Stock = require('./app/stock/network');
const GrupoContable = require('./app/grupocontable/network');
const CuentaContable = require('./app/cuentacontable/network');
const PeriodoContable = require('./app/periodocontable/network');
const PartidaContable = require('./app/partidacontable/network');
const TipoComprobante = require('./app/tipocomprobante/network');
const Compra = require('./app/compra/network');
const UsuarioSucursal = require('./app/usuariosucursal/network');
const Sat = require('./app/sat/network');
const Encuesta = require('./app/encuesta/network');
const CuentaBancaria = require('./app/cuentabancaria/network');
const CuentaBancariaTransaccion = require('./app/cuentabancariatransaccion/network');
const Importacion = require('./app/importar/network');
const TipoPresentacion = require('./app/tipopresentacion/network');
const Factura = require('./app/factura/network');
const Cliente = require('./app/cliente/network');
//Estratgia de json web token
require('../auth/strategies/jwt');

const app = express();
app.use(helmet()); //Para modificar los encabezados de las peticiones

app.use(bodyParser.json());
app.use(cookieParser(secret));
app.use(passport.initialize());
app.use(cors());
//Inicio Rutas Base
app.use('/api/auth', Auth);
app.use('/api/estado', passport.authenticate('jwt', { session: false }), Estado);
app.use('/api/municipio', passport.authenticate('jwt', { session: false }), Municipio);
app.use('/api/pais', passport.authenticate('jwt', { session: false }), Pais);
app.use('/api/departamento', passport.authenticate('jwt', { session: false }), Departamento);
app.use('/api/estadocivil', passport.authenticate('jwt', { session: false }), EstadoCivil);
app.use('/api/tipodocumento', passport.authenticate('jwt', { session: false }), TipoDocumento);
app.use('/api/tiposangre', passport.authenticate('jwt', { session: false }), TipoSangre);
app.use('/api/tipotelefono', passport.authenticate('jwt', { session: false }), TipoTelefono);
app.use('/api/genero', passport.authenticate('jwt', { session: false }), Genero);
app.use('/api/rol', passport.authenticate('jwt', { session: false }), Rol);
app.use('/api/persona', passport.authenticate('jwt', { session: false }), Persona);
app.use('/api/persona/datoextra', passport.authenticate('jwt', { session: false }), DatoExtraPersona);
app.use('/api/persona/direccion', passport.authenticate('jwt', { session: false }), DireccionPersona);
app.use('/api/persona/identificacion', passport.authenticate('jwt', { session: false }), IdentificacionPersona);
app.use('/api/persona/telefono', passport.authenticate('jwt', { session: false }), TelefonoPersona);
app.use('/api/usuario', passport.authenticate('jwt', { session: false }), Usuario);
app.use('/api/usuario/rol', passport.authenticate('jwt', { session: false }), UsuarioRol);
app.use('/api/usuario/foto', passport.authenticate('jwt', { session: false }), FotoUsuario);
app.use('/api/acceso', passport.authenticate('jwt', { session: false }), Acceso);
app.use('/api/menu', passport.authenticate('jwt', { session: false }), Menu);
app.use('/api/menuacceso', passport.authenticate('jwt', { session: false }), MenuAcceso);
app.use('/api/rolmenuacceso', passport.authenticate('jwt', { session: false }), RolMenuAcceso);
app.use('/api/resetpassword', ResetPassword);
app.use('/api/bitacora', passport.authenticate('jwt', { session: false }), Bitacora);
//Fin Rutas Base

app.use('/api/catalogo', passport.authenticate('jwt', { session: false }), Catalogo);
app.use('/api/proveedor', passport.authenticate('jwt', { session: false }), Proveedor);
app.use('/api/categoria', passport.authenticate('jwt', { session: false }), Categoria);
app.use('/api/sat', passport.authenticate('jwt', { session: false }), Sat);

app.use('/api/contactoproveedor', passport.authenticate('jwt', { session: false }), ContactoProveedor);
app.use('/api/telefonocontactoproveedor', passport.authenticate('jwt', { session: false }), TelefonoContactoProveedor);
app.use('/api/sucursal', passport.authenticate('jwt', { session: false }), Sucursal);
app.use('/api/bodega', passport.authenticate('jwt', { session: false }), Bodega);
app.use('/api/tipoproducto', passport.authenticate('jwt', { session: false }), TipoProducto);
app.use('/api/producto', passport.authenticate('jwt', { session: false }), Producto);
app.use('/api/loteproducto', passport.authenticate('jwt', { session: false }), LoteProducto);

app.use('/api/stock', passport.authenticate('jwt', { session: false }), Stock);
app.use('/api/grupocontable', passport.authenticate('jwt', { session: false }), GrupoContable);
app.use('/api/cuentacontable', passport.authenticate('jwt', { session: false }), CuentaContable);
app.use('/api/periodocontable', passport.authenticate('jwt', { session: false }), PeriodoContable);
app.use('/api/partidacontable', passport.authenticate('jwt', { session: false }), PartidaContable);
app.use('/api/tipocomprobante', passport.authenticate('jwt', { session: false }), TipoComprobante);
app.use('/api/compra', passport.authenticate('jwt', { session: false }), Compra);
app.use('/api/usuario/sucursal', passport.authenticate('jwt', { session: false }), UsuarioSucursal);
app.use('/api/encuesta', passport.authenticate('jwt', { session: false }), Encuesta);
app.use('/api/cuentabancaria', passport.authenticate('jwt', { session: false }), CuentaBancaria);
app.use('/api/cuentabancaria/transaccion', passport.authenticate('jwt', { session: false }), CuentaBancariaTransaccion);
app.use('/api/importacion', passport.authenticate('jwt', { session: false }), Importacion);
app.use('/api/tipopresentacion', passport.authenticate('jwt', { session: false }), TipoPresentacion);
app.use('/api/factura', passport.authenticate('jwt', { session: false }), Factura);
app.use('/api/cliente', passport.authenticate('jwt', { session: false }), Cliente);

//Es muy importante que sea el ultimo middelware
app.use(errors);

// app.get('/api/plantilla',passport.authenticate('jwt', { session: false }),(req,res)=>{
//     const archivo='./importar/plantillaPersonas.xlsx';
//     const fs = require("fs");
//     let dataSalida=fs.readFileSync(archivo);
//     return res.json(dataSalida);
// });

app.get("", (req, res) => {
    res.send('<h1>ApiContable</h1>');
});
app.listen(config.api.port, () => {
    console.log('Api escuchando en el puerto ', config.api.port);
});
