const citaModel = require("../models/citaModel");

// RF10: reporte de citas por odontologo y rango de fechas.
async function citasPorOdontologo(req, res, next) {
  try {
    const { desde, hasta } = req.query;
    const filas = await citaModel.resumenPorOdontologo(desde, hasta);

    const resumen = {};
    for (const fila of filas) {
      const nombre = fila.odontologos ? fila.odontologos.nombre : "Sin asignar";
      if (!resumen[nombre]) {
        resumen[nombre] = { pendiente: 0, atendida: 0, cancelada: 0, total: 0 };
      }
      resumen[nombre][fila.estado] = (resumen[nombre][fila.estado] || 0) + 1;
      resumen[nombre].total += 1;
    }

    res.json({ desde: desde || null, hasta: hasta || null, resumen });
  } catch (err) {
    next(err);
  }
}

module.exports = { citasPorOdontologo };
