const usuarioActual = protegerPagina(["odontologo"]);

function badgeEstado(estado) {
  const clases = { pendiente: "badge-pendiente", atendida: "badge-atendida", cancelada: "badge-cancelada" };
  return `<span class="badge ${clases[estado] || ""}">${estado}</span>`;
}

async function cargarMisCitas() {
  const fecha = document.getElementById("filtroFecha").value;
  const query = new URLSearchParams({ porPagina: 50 });
  if (fecha) query.set("fecha", fecha);

  try {
    // Nota: el listado general de /citas ya viene filtrado por lo que
    // el usuario puede ver; aqui ademas mostramos solo lo que le sirve
    // al odontologo (su propia agenda).
    const { data } = await apiFetch(`/citas?${query.toString()}`);
    const tbody = document.getElementById("tablaMisCitas");

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="5">No tienes citas para esa fecha.</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (c) => `
      <tr>
        <td>${c.pacientes ? c.pacientes.nombre : "-"}</td>
        <td>${c.fecha}</td>
        <td>${c.hora}</td>
        <td>${badgeEstado(c.estado)}</td>
        <td><button class="btn-primario" style="margin:0" onclick="abrirFormularioHistoria('${c.paciente_id}', '${c.id}', '${(c.pacientes && c.pacientes.nombre) || ""}')">Registrar</button></td>
      </tr>`
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

function abrirFormularioHistoria(pacienteId, citaId, nombrePaciente) {
  document.getElementById("tarjetaHistoria").style.display = "block";
  document.getElementById("hPacienteId").value = pacienteId;
  document.getElementById("hCitaId").value = citaId;
  document.getElementById("pacienteSeleccionadoTexto").textContent = `Paciente: ${nombrePaciente}`;
  window.scrollTo({ top: document.getElementById("tarjetaHistoria").offsetTop, behavior: "smooth" });
}

document.getElementById("formHistoria").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensajeHistoria");
  mensaje.innerHTML = "";
  try {
    await apiFetch("/historias", {
      method: "POST",
      body: JSON.stringify({
        pacienteId: document.getElementById("hPacienteId").value,
        citaId: document.getElementById("hCitaId").value,
        diagnostico: document.getElementById("hDiagnostico").value,
        tratamiento: document.getElementById("hTratamiento").value,
        notas: document.getElementById("hNotas").value,
      }),
    });
    mensaje.innerHTML = `<div class="mensaje-exito">Historia clinica guardada.</div>`;
    document.getElementById("formHistoria").reset();
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
});

async function cargarSelectPacientes() {
  try {
    const { data } = await apiFetch("/pacientes?porPagina=100");
    document.getElementById("selectPacienteHistorial").innerHTML = data
      .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function verHistorialPaciente() {
  const pacienteId = document.getElementById("selectPacienteHistorial").value;
  const contenedor = document.getElementById("listaHistorial");
  try {
    // RN02: el backend ya se encarga de devolver solo lo que este
    // odontologo puede ver (sus propias entradas).
    const { historial } = await apiFetch(`/pacientes/${pacienteId}/historial`);
    if (!historial.length) {
      contenedor.innerHTML = "<p>Este paciente no tiene historia clinica registrada por ti todavia.</p>";
      return;
    }
    contenedor.innerHTML = historial
      .map(
        (h) => `
        <div class="tarjeta" style="background:#F8FAFB">
          <strong>${h.fecha}</strong> &mdash; ${h.diagnostico || "(sin diagnostico)"}<br/>
          <small>Tratamiento: ${h.tratamiento || "-"}</small><br/>
          <small>Notas: ${h.notas || "-"}</small>
        </div>`
      )
      .join("");
  } catch (err) {
    contenedor.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
}

cargarMisCitas();
cargarSelectPacientes();
