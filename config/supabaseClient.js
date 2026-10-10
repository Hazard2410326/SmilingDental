// Patron Singleton (documento, seccion 5.5): toda la aplicacion
// reutiliza esta MISMA instancia del cliente de Supabase en vez de
// crear una conexion nueva cada vez que se necesita.
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    "[SmileTrack] Falta SUPABASE_URL o SUPABASE_KEY en el archivo .env. " +
    "Copia .env.example como .env y completa tus credenciales de Supabase."
  );
}

let instancia = null;

function obtenerCliente() {
  if (!instancia) {
    instancia = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return instancia;
}

module.exports = obtenerCliente();
