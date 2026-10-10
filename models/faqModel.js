const supabase = require("../config/supabaseClient");

async function listarTodas() {
  const { data, error } = await supabase.from("preguntas_frecuentes").select("*");
  if (error) throw error;
  return data;
}

// RF09: administrar (crear) preguntas frecuentes.
async function crear(datos) {
  const { data, error } = await supabase
    .from("preguntas_frecuentes")
    .insert(datos)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function actualizar(id, datos) {
  const { data, error } = await supabase
    .from("preguntas_frecuentes")
    .update(datos)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = { listarTodas, crear, actualizar };
