const supabase = require("../config/supabaseClient");

// RF05: registrar una entrada de historia clinica.
async function crear(datos) {
  const { data, error } = await supabase
    .from("historias_clinicas")
    .insert(datos)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// RF06 / RN02: la restriccion de "quien puede ver esto" NO se hace
// aqui (el modelo solo trae datos): se aplica antes, en el
// controlador/middleware, comparando el rol y el odontologo_id.
async function listarPorPaciente(pacienteId) {
  const { data, error } = await supabase
    .from("historias_clinicas")
    .select("*, odontologos(nombre)")
    .eq("paciente_id", pacienteId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data;
}

module.exports = { crear, listarPorPaciente };
