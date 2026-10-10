const supabase = require("../config/supabaseClient");

// RF07: buscar un usuario por su correo para el login.
async function buscarPorEmail(email) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function buscarPorId(id) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nombre, email, rol")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = { buscarPorEmail, buscarPorId };
