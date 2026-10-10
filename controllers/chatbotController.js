const faqModel = require("../models/faqModel");
const chatbotService = require("../services/chatbotService");

// RF08: responder una pregunta del chatbot. Ruta publica, sin login.
async function consultar(req, res, next) {
  try {
    const { mensaje } = req.body;
    if (!mensaje || !mensaje.trim()) {
      const err = new Error("Escribe tu pregunta para poder ayudarte.");
      err.status = 400;
      throw err;
    }

    const listaFaq = await faqModel.listarTodas();
    const resultado = chatbotService.encontrarRespuesta(mensaje, listaFaq);

    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

// RF09: administrar (listar/crear/editar) las preguntas frecuentes.
async function listarPreguntas(req, res, next) {
  try {
    const preguntas = await faqModel.listarTodas();
    res.json({ preguntas });
  } catch (err) {
    next(err);
  }
}

async function crearPregunta(req, res, next) {
  try {
    const { pregunta, palabrasClave, respuesta } = req.body;
    if (!pregunta || !palabrasClave || !respuesta) {
      const err = new Error("Completa la pregunta, las palabras clave y la respuesta.");
      err.status = 400;
      throw err;
    }
    const nueva = await faqModel.crear({
      pregunta,
      palabras_clave: palabrasClave,
      respuesta,
    });
    res.status(201).json({ mensaje: "Pregunta frecuente creada.", pregunta: nueva });
  } catch (err) {
    next(err);
  }
}

async function actualizarPregunta(req, res, next) {
  try {
    const { id } = req.params;
    const { pregunta, palabrasClave, respuesta } = req.body;
    const actualizada = await faqModel.actualizar(id, {
      pregunta,
      palabras_clave: palabrasClave,
      respuesta,
    });
    res.json({ mensaje: "Pregunta frecuente actualizada.", pregunta: actualizada });
  } catch (err) {
    next(err);
  }
}

module.exports = { consultar, listarPreguntas, crearPregunta, actualizarPregunta };
