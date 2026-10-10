// Crea de antemano los usuarios de prueba del Anexo B del documento,
// con su contrasena ya hasheada con bcrypt. Se ejecuta UNA VEZ, antes
// de usar o mostrar el sistema, con:
//
//     npm run seed
//
// Asi las credenciales ya existen y NO hay que crearlas desde dentro
// del programa (requisito del proyecto).

require("dotenv").config();
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabaseClient");

const USUARIOS_DE_PRUEBA = [
  {
    nombre: "Administrador SMILING DENTAL",
    email: "admin@smilingdental.com",
    password: "Admin#2026",
    rol: "administrador",
  },
  {
    nombre: "Recepcion SMILING DENTAL",
    email: "recepcion@smilingdental.com",
    password: "Recepcion#2026",
    rol: "recepcionista",
  },
  {
    nombre: "Dr. Carlos Mendoza",
    email: "odontologo@smilingdental.com",
    password: "Odonto#2026",
    rol: "odontologo",
    especialidad: "Odontologia general",
  },
];

async function seed() {
  console.log("Creando usuarios de prueba en Supabase...\n");

  for (const u of USUARIOS_DE_PRUEBA) {
    const { data: existente } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", u.email)
      .maybeSingle();

    if (existente) {
      console.log(`- ${u.email} ya existia, se omite.`);
      continue;
    }

    const passwordHash = await bcrypt.hash(u.password, 10);

    const { data: nuevoUsuario, error } = await supabase
      .from("usuarios")
      .insert({
        nombre: u.nombre,
        email: u.email,
        password_hash: passwordHash,
        rol: u.rol,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creando ${u.email}:`, error.message);
      continue;
    }

    console.log(`- Creado ${u.email} (rol: ${u.rol})`);

    if (u.rol === "odontologo") {
      const { error: errorOdontologo } = await supabase
        .from("odontologos")
        .insert({
          usuario_id: nuevoUsuario.id,
          nombre: u.nombre,
          especialidad: u.especialidad,
        });
      if (errorOdontologo) {
        console.error("  Error creando fila en odontologos:", errorOdontologo.message);
      } else {
        console.log("  y su registro en odontologos.");
      }
    }
  }

  console.log("\nListo. Credenciales para usar en el login (ver Anexo B):");
  USUARIOS_DE_PRUEBA.forEach((u) =>
    console.log(`  ${u.rol.padEnd(14)} -> ${u.email} / ${u.password}`)
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("No se pudo completar el seed:", err.message);
  process.exit(1);
});
