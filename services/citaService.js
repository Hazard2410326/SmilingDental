const citaModel = require("../models/citaModel");

// Esta funcion existe porque tanto "crear cita" como "editar cita"
// necesitan aplicar RN01, y antes estaba repetida en los dos
// controladores (documento, seccion 5.4 - Responsabilidad Unica /
// evitar duplicar la regla de negocio en dos lugares).
async function validarNuevoHorario({ odontologoId, fecha, hora, citaIdAExcluir }) {
  const hayCruce = await citaModel.existeCruce(odontologoId, fecha, hora, citaIdAExcluir);
  if (hayCruce) {
    const err = new Error("El odontologo ya tiene una cita registrada a esa fecha y hora.");
    err.status = 409;
    err.codigoRegla = "RN01";
    throw err;
  }
}

async function validarSinCitaPendienteDuplicada({ pacienteId, tratamiento }) {
  if (!tratamiento) return;
  const yaExiste = await citaModel.existeCitaPendienteMismoTratamiento(pacienteId, tratamiento);
  if (yaExiste) {
    const err = new Error("Este paciente ya tiene una cita pendiente para el mismo tratamiento.");
    err.status = 409;
    err.codigoRegla = "RN04";
    throw err;
  }
}

// RN03: no se puede cancelar con menos de 2 horas de anticipacion.
function validarCancelacionATiempo(fecha, hora) {
  const fechaHoraCita = new Date(`${fecha}T${hora}`);
  const ahora = new Date();
  const diferenciaHoras = (fechaHoraCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

  if (diferenciaHoras < 2) {
    const err = new Error(
      "Esta cita ya no se puede cancelar desde el sistema porque faltan menos de 2 horas. " +
      "Pide a recepcion que la marque manualmente como cancelacion tardia."
    );
    err.status = 409;
    err.codigoRegla = "RN03";
    throw err;
  }
}

module.exports = {
  validarNuevoHorario,
  validarSinCitaPendienteDuplicada,
  validarCancelacionATiempo,
};
