const pacienteModel = require("../models/pacienteModel");
const historiaModel = require("../models/historiaClinicaModel");

// RF01: registrar un paciente nuevo.
async function crear(req, res, next) {
  try {
    const { nombre, telefono, fechaNacimiento, alergias } = req.body;
    if (!nombre) {
      const err = new Error("El nombre del paciente es obligatorio.");
      err.status = 400;
      throw err;
    }
    const nuevoPaciente = await pacienteModel.crear({
      nombre,
      telefono,
      fecha_nacimiento: fechaNacimiento || null,
      alergias,
    });
    res.status(201).json({ mensaje: "Paciente registrado.", paciente: nuevoPaciente });
  } catch (err) {
    next(err);
  }
}

// RF04: listar pacientes con busqueda y paginacion.
async function listar(req, res, next) {
  try {
    const { busqueda, pagina, porPagina } = req.query;
    const resultado = await pacienteModel.listar({
      busqueda,
      pagina: Number(pagina) || 1,
      porPagina: Number(porPagina) || 10,
    });
    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

async function actualizar(req, res, next) {
  try {
    const { id } = req.params;
    const { nombre, telefono, fechaNacimiento, alergias } = req.body;
    const paciente = await pacienteModel.actualizar(id, {
      nombre,
      telefono,
      fecha_nacimiento: fechaNacimiento,
      alergias,
    });
    res.json({ mensaje: "Paciente actualizado.", paciente });
  } catch (err) {
    next(err);
  }
}

// RF06 / RN02: solo el odontologo asignado a alguna cita de ese
// paciente, o el administrador, pueden ver su historia clinica.
async function verHistorial(req, res, next) {
  try {
    const { id } = req.params; // id del paciente
    const { rol, id: usuarioId } = req.usuario;

    if (rol === "recepcionista") {
      const err = new Error("No tienes permiso para ver la historia clinica de un paciente.");
      err.status = 403;
      throw err;
    }

    const historial = await historiaModel.listarPorPaciente(id);

    if (rol === "odontologo") {
      const odontologoModel = require("../models/odontologoModel");
      const odontologo = await odontologoModel.buscarPorUsuarioId(usuarioId);
      const historialFiltrado = historial.filter(
        (h) => odontologo && h.odontologo_id === odontologo.id
      );
      return res.json({ historial: historialFiltrado });
    }

    // administrador: ve todo
    res.json({ historial });
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar, actualizar, verHistorial };
