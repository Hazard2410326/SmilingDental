protegerPagina(["recepcionista"]);

let paginaActualCitas = 1;

async function cargarSelects() {
  try {
    const { data: pacientes } = await apiFetch("/pacientes?porPagina=100");
    const selectPaciente = document.getElementById("cPaciente");
    selectPaciente.innerHTML = pacientes
      .map((p) => `<option value="${p.id}">${p.nombre}</option>`)
      .join("");

    const { odontologos } = await apiFetch("/odontologos");
    const selectOdontologo = document.getElementById("cOdontologo");
    selectOdontologo.innerHTML = odontologos
      .map((o) => `<option value="${o.id}">${o.nombre}${o.especialidad ? " - " + o.especialidad : ""}</option>`)
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("formPaciente").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensajePaciente");
  mensaje.innerHTML = "";
  try {
    await apiFetch("/pacientes", {
      method: "POST",
      body: JSON.stringify({
        nombre: document.getElementById("pNombre").value,
        telefono: document.getElementById("pTelefono").value,
        fechaNacimiento: document.getElementById("pFechaNacimiento").value || null,
        alergias: document.getElementById("pAlergias").value,
      }),
    });
    mensaje.innerHTML = `<div class="mensaje-exito">Paciente registrado correctamente.</div>`;
    document.getElementById("formPaciente").reset();
    cargarSelects();
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
});

document.getElementById("formCita").addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById("mensajeCita");
  mensaje.innerHTML = "";
  try {
    await apiFetch("/citas", {
      method: "POST",
      body: JSON.stringify({
        pacienteId: document.getElementById("cPaciente").value,
        odontologoId: document.getElementById("cOdontologo").value,
        fecha: document.getElementById("cFecha").value,
        hora: document.getElementById("cHora").value,
        tratamiento: document.getElementById("cTratamiento").value,
        motivo: document.getElementById("cMotivo").value,
      }),
    });
    mensaje.innerHTML = `<div class="mensaje-exito">Cita registrada correctamente.</div>`;
    document.getElementById("formCita").reset();
    cargarCitas(1);
  } catch (err) {
    // Aqui llegan, por ejemplo, los mensajes de RN01 (cruce de horario) o RN04.
    mensaje.innerHTML = `<div class="mensaje-error">${err.message}</div>`;
  }
});

function badgeEstado(estado) {
  const clases = { pendiente: "badge-pendiente", atendida: "badge-atendida", cancelada: "badge-cancelada" };
  return `<span class="badge ${clases[estado] || ""}">${estado}</span>`;
}

async function cargarCitas(pagina) {
  paginaActualCitas = pagina;
  const fecha = document.getElementById("filtroFecha").value;
  const query = new URLSearchParams({ pagina, porPagina: 8 });
  if (fecha) query.set("fecha", fecha);

  try {
    const { data, total } = await apiFetch(`/citas?${query.toString()}`);
    const tbody = document.getElementById("tablaCitas");

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="6">No se encontraron citas con esos filtros.</td></tr>`;
    } else {
      tbody.innerHTML = data
        .map(
          (c) => `
        <tr>
          <td>${c.pacientes ? c.pacientes.nombre : "-"}</td>
          <td>${c.odontologos ? c.odontologos.nombre : "-"}</td>
          <td>${c.fecha}</td>
          <td>${c.hora}</td>
          <td>${badgeEstado(c.estado)}</td>
          <td>
            ${c.estado === "pendiente"
              ? `<button class="btn-peligro" onclick="cancelarCita('${c.id}')">Cancelar</button>`
              : "-"}
          </td>
        </tr>`
        )
        .join("");
    }

    const totalPaginas = Math.max(1, Math.ceil(total / 8));
    document.getElementById("paginacionCitas").innerHTML = `
      <button ${pagina <= 1 ? "disabled" : ""} onclick="cargarCitas(${pagina - 1})">Anterior</button>
      <span>Pagina ${pagina} de ${totalPaginas}</span>
      <button ${pagina >= totalPaginas ? "disabled" : ""} onclick="cargarCitas(${pagina + 1})">Siguiente</button>
    `;
  } catch (err) {
    console.error(err);
  }
}

async function cancelarCita(id) {
  if (!confirm("¿Seguro que deseas cancelar esta cita?")) return;
  try {
    await apiFetch(`/citas/${id}/cancelar`, { method: "PUT" });
    cargarCitas(paginaActualCitas);
  } catch (err) {
    // Aqui llega el mensaje de RN03 si faltan menos de 2 horas.
    alert(err.message);
  }
}

cargarSelects();
cargarCitas(1);
