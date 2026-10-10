document.getElementById("formLogin").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const mensajeGeneral = document.getElementById("mensajeGeneral");
  const errorEmail = document.getElementById("errorEmail");
  const errorPassword = document.getElementById("errorPassword");

  errorEmail.textContent = "";
  errorPassword.textContent = "";
  mensajeGeneral.innerHTML = "";

  let valido = true;
  if (!email) { errorEmail.textContent = "Ingresa tu correo."; valido = false; }
  if (!password) { errorPassword.textContent = "Ingresa tu contrasena."; valido = false; }
  if (!valido) return;

  try {
    const datos = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    guardarSesion(datos.token, datos.usuario);

    // RF07: redirige segun el rol.
    const destinos = {
      administrador: "/admin.html",
      recepcionista: "/recepcion.html",
      odontologo: "/odontologo.html",
    };
    window.location.href = destinos[datos.usuario.rol] || "/index.html";
  } catch (err) {
    mensajeGeneral.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
});
