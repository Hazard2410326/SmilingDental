protegerPagina(["administrador"]);

async function cargarReporte() {
  const desde = document.getElementById("repDesde").value;
  const hasta = document.getElementById("repHasta").value;
  const query = new URLSearchParams();
  if (desde) query.set("desde", desde);
  if (hasta) query.set("hasta", hasta);

  try {
    const { resumen } = await apiFetch(`/reportes/citas?${query.toString()}`);
    const filas = Object.entries(resumen);
    const tbody = document.getElementById("tablaReporte");

    if (!filas.length) {
      tbody.innerHTML = `<tr><td colspan="5">No hay citas registradas en ese rango.</td></tr>`;
      return;
    }

    tbody.innerHTML = filas
      .map(
        ([nombre, r]) => `
      <tr>
        <td>${nombre}</td>
        <td>${r.pendiente || 0}</td>
        <td>${r.atendida || 0}</td>
        <td>${r.cancelada || 0}</td>
        <td><strong>${r.total}</strong></td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function cargarFaq() {
  try {
    const { preguntas } = await apiFetch("/chatbot/preguntas");
    document.getElementById("tablaFaq").innerHTML = preguntas
      .map(
        (p) => `<tr><td>${p.pregunta}</td><td>${p.palabras_clave}</td><td>${p.respuesta}</td></tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("formFaq").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensajeFaq");
  mensaje.innerHTML = "";
  try {
    await apiFetch("/chatbot/preguntas", {
      method: "POST",
      body: JSON.stringify({
        pregunta: document.getElementById("fPregunta").value,
        palabrasClave: document.getElementById("fPalabras").value,
        respuesta: document.getElementById("fRespuesta").value,
      }),
    });
    mensaje.innerHTML = `<div class="mensaje-exito">Pregunta agregada al chatbot.</div>`;
    document.getElementById("formFaq").reset();
    cargarFaq();
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
});

cargarReporte();
cargarFaq();
