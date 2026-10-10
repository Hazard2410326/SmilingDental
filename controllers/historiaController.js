const historiaModel = require("../models/historiaClinicaModel");
const odontologoModel = require("../models/odontologoModel");

// RF05: registrar una entrada de historia clinica. Solo el
// odontologo que atendio puede crearla.
async function crear(req, res, next) {
  try {
    const { pacienteId, citaId, diagnostico, tratamiento, notas } = req.body;
    const { rol, id: usuarioId } = req.usuario;

    if (rol !== "odontologo") {
      const err = new Error("Solo un odontologo puede registrar una historia clinica.");
      err.status = 403;
      throw err;
    }

    const odontologo = await odontologoModel.buscarPorUsuarioId(usuarioId);
    if (!odontologo) {
      const err = new Error("No se encontro el registro de odontologo para este usuario.");
      err.status = 404;
      throw err;
    }

    if (!pacienteId || !diagnostico) {
      const err = new Error("Completa el paciente y el diagnostico.");
      err.status = 400;
      throw err;
    }

    const nuevaHistoria = await historiaModel.crear({
      paciente_id: pacienteId,
      odontologo_id: odontologo.id,
      cita_id: citaId || null,
      diagnostico,
      tratamiento,
      notas,
    });

    res.status(201).json({ mensaje: "Historia clinica registrada.", historia: nuevaHistoria });
  } catch (err) {
    next(err);
  }
}

module.exports = { crear };
