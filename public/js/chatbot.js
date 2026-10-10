document.getElementById("formChat").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("inputMensaje");
  const mensajes = document.getElementById("mensajes");
  const texto = input.value.trim();
  if (!texto) return;

  mensajes.innerHTML += `<div class="chatbot-mensaje-usuario">${texto}</div>`;
  input.value = "";
  mensajes.scrollTop = mensajes.scrollHeight;

  try {
    // RF08 / RN05: ruta publica, no requiere token.
    const respuesta = await fetch("/api/chatbot/consulta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: texto }),
    }).then((r) => r.json());

    mensajes.innerHTML += `<div class="chatbot-mensaje-bot">${respuesta.respuesta}</div>`;
  } catch (err) {
    mensajes.innerHTML += `<div class="chatbot-mensaje-bot">No pudimos responder en este momento, intenta de nuevo.</div>`;
  }
  mensajes.scrollTop = mensajes.scrollHeight;
});
