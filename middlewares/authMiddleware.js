const jwt = require("jsonwebtoken");

// RF07: valida que la peticion traiga un token valido antes de
// dejarla pasar al controlador.
function verificarToken(req, res, next) {
  const encabezado = req.headers.authorization;
  if (!encabezado || !encabezado.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Tu sesion vencio, vuelve a iniciar sesion." });
  }

  const token = encabezado.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nombre, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Tu sesion vencio, vuelve a iniciar sesion." });
  }
}

// Recibe uno o mas roles permitidos para esa ruta.
// Ejemplo de uso: soloRol("administrador", "recepcionista")
function soloRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: "No tienes permiso para realizar esta accion.",
      });
    }
    next();
  };
}

module.exports = { verificarToken, soloRol };
