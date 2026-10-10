// RN05: el chatbot solo responde preguntas que reconoce de la lista
// de preguntas_frecuentes, comparando por palabras clave. Si no
// reconoce nada, NUNCA inventa una respuesta.
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes
}

function encontrarRespuesta(mensajeUsuario, listaFaq) {
  const mensajeNormalizado = normalizar(mensajeUsuario);

  for (const faq of listaFaq) {
    const palabrasClave = faq.palabras_clave.split(",").map((p) => normalizar(p.trim()));
    const coincide = palabrasClave.some((palabra) => mensajeNormalizado.includes(palabra));
    if (coincide) {
      return { encontrada: true, respuesta: faq.respuesta, pregunta: faq.pregunta };
    }
  }

  return {
    encontrada: false,
    respuesta:
      "No tengo esa informacion todavia. Un miembro de SMILING DENTAL te va a escribir " +
      "para ayudarte con tu consulta.",
  };
}

module.exports = { encontrarRespuesta, normalizar };
