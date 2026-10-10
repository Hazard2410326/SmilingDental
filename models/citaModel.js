const supabase = require("../config/supabaseClient");

// RN01: verifica si el odontologo ya tiene una cita (no cancelada)
// exactamente a esa fecha y hora, antes de guardar una nueva.
async function existeCruce(odontologoId, fecha, hora, citaIdAExcluir = null) {
  let query = supabase
    .from("citas")
    .select("id")
    .eq("odontologo_id", odontologoId)
    .eq("fecha", fecha)
    .eq("hora", hora)
    .neq("estado", "cancelada");

  if (citaIdAExcluir) {
    query = query.neq("id", citaIdAExcluir);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data && data.length > 0;
}

// RN04: verifica si el paciente ya tiene una cita "pendiente" para
// el mismo tratamiento.
async function existeCitaPendienteMismoTratamiento(pacienteId, tratamiento) {
  const { data, error } = await supabase
    .from("citas")
    .select("id")
    .eq("paciente_id", pacienteId)
    .eq("tratamiento", tratamiento)
    .eq("estado", "pendiente");
  if (error) throw error;
  return data && data.length > 0;
}

// RF02: crear la cita (se llama solo despues de validar RN01/RN04
// en el controlador).
async function crear(datos) {
  const { data, error } = await supabase
    .from("citas")
    .insert(datos)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// RF04: listar citas con filtros por paciente, odontologo, fecha
// y paginacion.
async function listar({ pacienteId, odontologoId, fecha, pagina = 1, porPagina = 10 }) {
  const desde = (pagina - 1) * porPagina;
  const hasta = desde + porPagina - 1;

  let query = supabase
    .from("citas")
    .select("*, pacientes(nombre), odontologos(nombre)", { count: "exact" })
    .order("fecha", { ascending: false })
    .order("hora", { ascending: false })
    .range(desde, hasta);

  if (pacienteId) query = query.eq("paciente_id", pacienteId);
  if (odontologoId) query = query.eq("odontologo_id", odontologoId);
  if (fecha) query = query.eq("fecha", fecha);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, total: count };
}

async function buscarPorId(id) {
  const { data, error } = await supabase
    .from("citas")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// RF03: editar una cita existente.
async function actualizar(id, datos) {
  const { data, error } = await supabase
    .from("citas")
    .update(datos)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// RF03 / RN03: cancelar una cita.
async function cancelar(id) {
  return actualizar(id, { estado: "cancelada" });
}

// RF10: resumen de citas por odontologo y rango de fechas.
async function resumenPorOdontologo(desde, hasta) {
  let query = supabase
    .from("citas")
    .select("odontologo_id, estado, odontologos(nombre)");

  if (desde) query = query.gte("fecha", desde);
  if (hasta) query = query.lte("fecha", hasta);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

module.exports = {
  existeCruce,
  existeCitaPendienteMismoTratamiento,
  crear,
  listar,
  buscarPorId,
  actualizar,
  cancelar,
  resumenPorOdontologo,
};
