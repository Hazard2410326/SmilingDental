const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuarioModel");

// RF07: autenticar con correo y contrasena, devolver un token segun el rol.
// Las credenciales ya existen de antemano (creadas con "npm run seed"),
// aqui solo se verifican, nunca se crean.
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Ingresa tu correo y tu contrasena.");
      err.status = 400;
      throw err;
    }

    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contrasena incorrectos." });
    }

    const coincide = await bcrypt.compare(password, usuario.password_hash);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Correo o contrasena incorrectos." });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (err) {
    next(err);
  }
}

// Devuelve los datos del usuario logueado (util para el frontend
// al recargar la pagina y ya tener el token guardado).
async function perfil(req, res, next) {
  try {
    const usuario = await usuarioModel.buscarPorId(req.usuario.id);
    res.json({ usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, perfil };
