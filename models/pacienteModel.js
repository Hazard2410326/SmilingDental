const supabase = require("../config/supabaseClient");

// RF01: registrar un nuevo paciente.
async function crear(datos) {
  const { data, error } = await supabase
    .from("pacientes")
    .insert(datos)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// RF04: listar pacientes con busqueda por nombre y paginacion.
async function listar({ busqueda = "", pagina = 1, porPagina = 10 }) {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let query = supabase
    .from("pacientes")
    .select("*", { count: "exact" })
    .order("nombre", { ascending: true })
    .range(desde, hasta);

  if (busqueda) {
    query = query.ilike("nombre", `%${busqueda}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, total: count };
}

async function buscarPorId(id) {
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function actualizar(id, datos) {
  const { data, error } = await supabase
    .from("pacientes")
    .update(datos)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = { crear, listar, buscarPorId, actualizar };
