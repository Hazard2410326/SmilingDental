const supabase = require("../config/supabaseClient");

async function listar() {
  const { data, error } = await supabase
    .from("odontologos")
    .select("*")
    .order("nombre", { ascending: true });
  if (error) throw error;
  return data;
}

async function buscarPorUsuarioId(usuarioId) {
  const { data, error } = await supabase
    .from("odontologos")
    .select("*")
    .eq("usuario_id", usuarioId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = { listar, buscarPorUsuarioId };
