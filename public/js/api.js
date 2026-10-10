// Envoltorio simple para llamar a la API con fetch, agregando
// automaticamente el token de sesion cuando existe.
const API_BASE = "/api";

function obtenerToken() {
  return localStorage.getItem("smiletrack_token");
}

async function apiFetch(ruta, opciones = {}) {
  const token = obtenerToken();
  const headers = {
    "Content-Type": "application/json",
    ...(opciones.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const respuesta = await fetch(`${API_BASE}${ruta}`, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrio un error inesperado.");
  }
  return datos;
}

function guardarSesion(token, usuario) {
  localStorage.setItem("smiletrack_token", token);
  localStorage.setItem("smiletrack_usuario", JSON.stringify(usuario));
}

function obtenerUsuario() {
  const datos = localStorage.getItem("smiletrack_usuario");
  return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
  localStorage.removeItem("smiletrack_token");
  localStorage.removeItem("smiletrack_usuario");
  window.location.href = "/index.html";
}

// Protege una pagina: si no hay token o el rol no coincide, redirige al login.
function protegerPagina(rolesPermitidos) {
  const token = obtenerToken();
  const usuario = obtenerUsuario();
  if (!token || !usuario || !rolesPermitidos.includes(usuario.rol)) {
    window.location.href = "/index.html";
  }
  return usuario;
}
