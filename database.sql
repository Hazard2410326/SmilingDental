-- =====================================================================
-- SmileTrack - SMILING DENTAL
-- Script de creacion de base de datos para Supabase (PostgreSQL)
-- Ejecutar completo en: Supabase > SQL Editor > New query > Run
-- Coincide con el modelo de datos descrito en el Capitulo 5.7 del
-- documento del proyecto.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Tabla: usuarios
-- Guarda a toda persona que puede iniciar sesion en el sistema
-- (administrador, recepcionista, odontologo). RF07.
-- ---------------------------------------------------------------------
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null unique,
  password_hash text not null,
  rol text not null check (rol in ('administrador', 'recepcionista', 'odontologo')),
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: odontologos
-- Datos propios del odontologo, ligados a su cuenta de usuario.
-- ---------------------------------------------------------------------
create table if not exists odontologos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id) on delete cascade,
  nombre text not null,
  especialidad text,
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: pacientes
-- RF01.
-- ---------------------------------------------------------------------
create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text,
  fecha_nacimiento date,
  alergias text,
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: citas
-- RF02, RF03, RF04, RF11, RF12.
-- La restriccion "unique" de abajo es el respaldo en base de datos
-- de la regla de negocio RN01 (un odontologo no puede tener dos
-- citas a la misma fecha y hora).
-- ---------------------------------------------------------------------
create table if not exists citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  odontologo_id uuid not null references odontologos(id) on delete cascade,
  fecha date not null,
  hora time not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'atendida', 'cancelada')),
  tratamiento text,
  motivo text,
  creado_en timestamptz not null default now(),
  unique (odontologo_id, fecha, hora)
);

-- ---------------------------------------------------------------------
-- Tabla: historias_clinicas
-- RF05, RF06 (RN02: solo el odontologo asignado y el administrador
-- pueden leerla; esa restriccion se aplica en el middleware de la
-- API, ver /middlewares/authMiddleware.js).
-- ---------------------------------------------------------------------
create table if not exists historias_clinicas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  odontologo_id uuid not null references odontologos(id) on delete cascade,
  cita_id uuid references citas(id) on delete set null,
  fecha date not null default current_date,
  diagnostico text,
  tratamiento text,
  notas text,
  creado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabla: preguntas_frecuentes
-- RF08, RF09, RN05 (chatbot por palabras clave).
-- "palabras_clave" guarda varias palabras separadas por coma,
-- por ejemplo: 'horario,atencion,hora'
-- ---------------------------------------------------------------------
create table if not exists preguntas_frecuentes (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null,
  palabras_clave text not null,
  respuesta text not null,
  creado_en timestamptz not null default now()
);

-- =====================================================================
-- Datos de ejemplo (seed) para poder probar el sistema de inmediato.
-- Los USUARIOS (con su contrasena) NO se insertan aqui porque la
-- contrasena debe guardarse con hash de bcrypt, que este script SQL
-- no puede calcular. Para crear los usuarios de prueba ya listos
-- (Anexo B del documento) ejecutar, despues de "npm install":
--
--     npm run seed
--
-- Ese comando inserta directamente en Supabase a:
--   admin@smilingdental.com       (administrador)
--   recepcion@smilingdental.com   (recepcionista)
--   odontologo@smilingdental.com  (odontologo)
-- con su contrasena ya hasheada, para que existan credenciales listas
-- ANTES de usar el programa (tal como se pidio: no crear credenciales
-- desde dentro de la aplicacion).
-- =====================================================================

insert into pacientes (nombre, telefono, fecha_nacimiento, alergias) values
  ('Ana Torres', '987654321', '1990-04-12', 'Ninguna conocida'),
  ('Luis Ramirez', '976543210', '1985-09-03', 'Alergia a la penicilina'),
  ('Carla Gomez', '965432109', '2001-01-20', 'Ninguna conocida');

insert into preguntas_frecuentes (pregunta, palabras_clave, respuesta) values
  ('Horario de atencion',
   'horario,hora,atencion,abren,cierran',
   'Atendemos de lunes a sabado de 9:00 a.m. a 7:00 p.m.'),
  ('Costo de limpieza dental',
   'costo,precio,limpieza,cuanto cuesta',
   'La limpieza dental basica tiene un costo referencial que te confirmamos al agendar tu cita, ya que puede variar segun tu caso.'),
  ('Atencion por seguro',
   'seguro,eps,cobertura',
   'Trabajamos con boleta/factura para reembolso, pero no estamos afiliados directamente a ninguna EPS por el momento.'),
  ('Citas el mismo dia',
   'mismo dia,urgencia,emergencia,hoy',
   'Si es una urgencia, escribenos indicando tu molestia y te confirmamos el primer espacio disponible del dia.');

-- Nota: los odontologos se crean junto con su usuario en "npm run seed",
-- porque cada odontologo depende de un usuario_id ya existente.
