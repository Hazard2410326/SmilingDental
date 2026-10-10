const citaModel = require("../models/citaModel");
const citaService = require("../services/citaService");

// RF02: crear una cita, validando RN01 (cruce de horario) y
// RN04 (cita pendiente duplicada) antes de guardar.
async function crear(req, res, next) {
  try {
    const { pacienteId, odontologoId, fecha, hora, tratamiento, motivo } = req.body;

    if (!pacienteId || !odontologoId || !fecha || !hora) {
      const err = new Error("Completa paciente, odontologo, fecha y hora de la cita.");
      err.status = 400;
      throw err;
    }

    await citaService.validarNuevoHorario({ odontologoId, fecha, hora });
    await citaService.validarSinCitaPendienteDuplicada({ pacienteId, tratamiento });

    const nuevaCita = await citaModel.crear({
      paciente_id: pacienteId,
      odontologo_id: odontologoId,
      fecha,
      hora,
      tratamiento,
      motivo,
      estado: "pendiente",
    });

    res.status(201).json({ mensaje: "Cita registrada correctamente.", cita: nuevaCita });
  } catch (err) {
    next(err);
  }
}

// RF04: listar citas con filtros y paginacion.
async function listar(req, res, next) {
  try {
    const { pacienteId, odontologoId, fecha, pagina, porPagina } = req.query;
    const resultado = await citaModel.listar({
      pacienteId,
      odontologoId,
      fecha,
      pagina: Number(pagina) || 1,
      porPagina: Number(porPagina) || 10,
    });
    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// RF03: editar una cita (reprogramar fecha/hora), validando RN01
// otra vez pero excluyendo la propia cita de la comparacion.
async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { fecha, hora, tratamiento, motivo } = req.body;

    const citaActual = await citaModel.buscarPorId(id);
    if (!citaActual) {
      const err = new Error("No encontramos esa cita.");
      err.status = 404;
      throw err;
    }

    if (fecha && hora) {
      await citaService.validarNuevoHorario({
        odontologoId: citaActual.odontologo_id,
        fecha,
        hora,
        citaIdAExcluir: id,
      });
    }

    const citaActualizada = await citaModel.actualizar(id, {
      fecha: fecha || citaActual.fecha,
      hora: hora || citaActual.hora,
      tratamiento: tratamiento ?? citaActual.tratamiento,
      motivo: motivo ?? citaActual.motivo,
    });

    res.json({ mensaje: "Cita actualizada.", cita: citaActualizada });
  } catch (err) {
    next(err);
  }
}

// RF03 / RN03: cancelar una cita, validando que falten al menos 2 horas.
async function cancelar(req, res, next) {
  try {
    const { id } = req.params;
    const cita = await citaModel.buscarPorId(id);
    if (!cita) {
      const err = new Error("No encontramos esa cita.");
      err.status = 404;
      throw err;
    }

    citaService.validarCancelacionATiempo(cita.fecha, cita.hora);

    const citaCancelada = await citaModel.cancelar(id);
    res.json({ mensaje: "Cita cancelada.", cita: citaCancelada });
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, actualizar, cancelar };
