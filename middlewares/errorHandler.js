// Manejador central de errores. Coincide con la tabla de la
// seccion 5.6 del documento (que error da que codigo y que mensaje).
function errorHandler(err, req, res, next) {
  console.error(`[SmileTrack] ${req.method} ${req.originalUrl} ->`, err.message);

  const status = err.status || 500;
  const mensaje =
    status === 500
      ? "Hubo un problema, intenta de nuevo en un momento."
      : err.message;

  res.status(status).json({
    mensaje,
    reglaIncumplida: err.codigoRegla || undefined,
  });
}

module.exports = errorHandler;
