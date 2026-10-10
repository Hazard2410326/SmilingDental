# SmileTrack — SMILING DENTAL

Sistema de Gestión de Citas y Soporte (Chatbot) para el consultorio dental SMILING DENTAL. Este archivo explica, paso a paso y sin dar nada por sabido, cómo dejar el proyecto funcionando en tu computadora.

---

## Parte 1. Programas que necesitas descargar (una sola vez)

Instala estos 3 programas, en este orden. Todos son gratis.

### 1. Visual Studio Code (el editor de código)
1. Entra a **https://code.visualstudio.com**
2. Haz clic en el botón grande de descarga (detecta tu sistema operativo automáticamente: Windows, Mac o Linux).
3. Abre el instalador descargado y dale "Siguiente" a todo, dejando las opciones por defecto.

### 2. Node.js (lo que permite correr el programa)
1. Entra a **https://nodejs.org**
2. Descarga la versión que dice **LTS** (es la recomendada, más estable).
3. Instala igual que cualquier programa, dándole "Siguiente" a todo.
4. Para comprobar que quedó instalado: abre el programa "Símbolo del sistema" en Windows (o "Terminal" en Mac) y escribe:
   ```
   node -v
   ```
   Si te devuelve un número de versión (por ejemplo `v20.11.0`), quedó instalado correctamente.

### 3. Una cuenta de Supabase (la base de datos)
1. Entra a **https://supabase.com**
2. Haz clic en "Start your project" e inicia sesión con tu cuenta de GitHub o de correo.
3. Crea un proyecto nuevo (botón "New project"): ponle de nombre `smiling-dental`, elige una contraseña para la base de datos (guárdala, la vas a necesitar) y espera 1-2 minutos a que Supabase lo termine de crear.

Con esos 3 programas ya tienes todo lo necesario. No necesitas instalar nada más (Express, Supabase-js, etc. se instalan solos en el Paso 3 de la Parte 2).

---

## Parte 2. Dejar el proyecto funcionando en tu computadora

### Paso 1. Abrir el proyecto en Visual Studio Code
1. Descomprime el archivo `.zip` que te compartieron en una carpeta de tu computadora (por ejemplo, en el Escritorio).
2. Abre Visual Studio Code.
3. Ve al menú **Archivo (File) → Abrir carpeta (Open Folder)**.
4. Busca y selecciona la carpeta `smiling-dental` que acabas de descomprimir, y dale "Seleccionar carpeta".
5. A la izquierda deberías ver toda la lista de carpetas y archivos del proyecto (`config`, `controllers`, `models`, `public`, etc.).

### Paso 2. Abrir la terminal dentro de Visual Studio Code
1. Ve al menú de arriba: **Terminal → Nueva terminal (New Terminal)**.
2. Se abre un recuadro negro en la parte de abajo de la pantalla: ahí es donde vas a escribir los comandos de los siguientes pasos.

### Paso 3. Instalar lo que el proyecto necesita
En la terminal que acabas de abrir, escribe este comando y presiona Enter:
```
npm install
```
Esto va a tardar uno o dos minutos. Va a crear una carpeta llamada `node_modules` (no la toques, ni la subas a GitHub).

### Paso 4. Conectar el proyecto a tu base de datos de Supabase
1. Entra a tu proyecto en **https://supabase.com** (el que creaste en la Parte 1).
2. En el menú de la izquierda, ve al ícono de engranaje **Project Settings → API**.
3. Ahí vas a ver dos datos que necesitas copiar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga de letras y números)
4. En Visual Studio Code, busca el archivo `.env.example` en la lista de archivos, haz clic derecho sobre él y elige **"Copiar" (Copy)**, luego clic derecho en un espacio vacío de la lista de archivos y elige **"Pegar" (Paste)**. Va a crear una copia llamada `.env.example copy.txt` o similar.
5. Haz clic derecho sobre esa copia y elige **"Cambiar nombre" (Rename)**. Ponle exactamente: `.env`
6. Abre el archivo `.env` (doble clic) y complétalo así, reemplazando por tus datos reales de Supabase:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=tu-anon-public-key-aqui
   JWT_SECRET=cualquier-frase-larga-y-secreta-que-inventes
   PORT=3000
   ```
7. Guarda el archivo (`Ctrl + S` o `Cmd + S`).

### Paso 5. Crear las tablas en Supabase
1. En tu proyecto de Supabase, ve al menú de la izquierda al ícono **SQL Editor**.
2. Haz clic en **"New query"**.
3. En Visual Studio Code, abre el archivo `database.sql`, selecciona todo su contenido (`Ctrl + A`) y cópialo (`Ctrl + C`).
4. Pégalo dentro del recuadro del SQL Editor de Supabase.
5. Haz clic en el botón **"Run"** (o presiona `Ctrl + Enter`). Debería decir "Success" al terminar. Esto crea todas las tablas (usuarios, pacientes, citas, historias clínicas, preguntas frecuentes) y los datos de ejemplo (3 pacientes y 4 preguntas frecuentes).

### Paso 6. Crear los usuarios de prueba (las credenciales que ya deben existir)
En la terminal de Visual Studio Code, escribe:
```
npm run seed
```
Esto crea automáticamente 3 usuarios ya listos para usar, con su contraseña, para que **no tengas que crear ninguna cuenta desde dentro del programa**:

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@smilingdental.com | Admin#2026 |
| Recepcionista | recepcion@smilingdental.com | Recepcion#2026 |
| Odontólogo | odontologo@smilingdental.com | Odonto#2026 |

### Paso 7. Levantar el programa
En la terminal, escribe:
```
npm run dev
```
Si todo salió bien, vas a ver el mensaje:
```
SmileTrack corriendo en http://localhost:3000
```
Deja esa terminal abierta (si la cierras, el programa se apaga).

### Paso 8. Abrir el programa en el navegador
1. Abre Chrome (o cualquier navegador).
2. Ve a la dirección: **http://localhost:3000**
3. Deberías ver la pantalla de inicio de sesión de SMILING DENTAL. Prueba entrar con cualquiera de las 3 credenciales de la tabla del Paso 6.
4. Para probar el chatbot sin iniciar sesión, ve a **http://localhost:3000/chatbot.html**

---

## Qué probar primero (para tu exposición)

1. Entra como **recepcionista** → registra un paciente → agenda una cita.
2. Intenta agendar **otra** cita para el mismo odontólogo, misma fecha y misma hora → el sistema la debe rechazar (esto es la regla RN01, el corazón del proyecto).
3. Entra como **odontólogo** → mira "Mis citas" → registra una historia clínica para un paciente atendido.
4. Entra como **recepcionista** de nuevo y comprueba que **no** puede ver la historia clínica (eso es RN02).
5. Entra como **administrador** → mira el reporte de citas y agrega una pregunta nueva al chatbot.
6. Ve a `/chatbot.html` sin iniciar sesión y pregúntale algo que sí está en las preguntas frecuentes, y algo que no está, para mostrar los dos casos de RN05.

---

## Estructura del proyecto (Modelo Vista Controlador)

```
smiling-dental/
├── server.js                 # Punto de entrada del servidor Express
├── database.sql              # Script para crear las tablas en Supabase
├── .env.example               # Plantilla de variables de entorno (copiar como .env)
├── config/
│   └── supabaseClient.js      # Conexión única a Supabase (patrón Singleton)
├── models/                    # Acceso a los datos (una consulta por función)
├── controllers/               # Reciben la petición y aplican las reglas de negocio
├── routes/                    # Qué URL de la API llama a qué controlador
├── middlewares/                # Verificación de token, roles y manejo de errores
├── services/                   # Reglas de negocio reutilizadas (RN01, RN03, RN04, RN05)
├── scripts/
│   └── seedUsers.js           # Crea las credenciales de prueba (Paso 6)
└── public/                    # Todo lo que ve el navegador (HTML, CSS, JS)
    ├── index.html              # Login
    ├── recepcion.html           # Panel de la recepcionista
    ├── odontologo.html           # Panel del odontólogo
    ├── admin.html                 # Panel del administrador
    ├── chatbot.html                # Chatbot público
    ├── css/styles.css
    └── js/                        # Un archivo JS por pantalla, más api.js (conexión con el backend)
```

## Reglas de negocio implementadas en el código

| Regla | Dónde está en el código |
|---|---|
| RN01 — no cruzar horario de un odontólogo | `services/citaService.js` (`validarNuevoHorario`) + restricción `unique` en `database.sql` |
| RN02 — solo el odontólogo asignado o el admin ven la historia clínica | `controllers/pacienteController.js` (`verHistorial`) |
| RN03 — no cancelar con menos de 2 horas | `services/citaService.js` (`validarCancelacionATiempo`) |
| RN04 — no dos citas pendientes del mismo tratamiento | `services/citaService.js` (`validarSinCitaPendienteDuplicada`) |
| RN05 — chatbot solo responde lo que reconoce | `services/chatbotService.js` (`encontrarRespuesta`) |

## Si algo no funciona

- **"npm no se reconoce como un comando"** → Node.js no quedó bien instalado; vuelve a la Parte 1, Paso 2, y reinicia la computadora después de instalar.
- **El login dice "Correo o contraseña incorrectos"** → revisa que hayas corrido `npm run seed` (Paso 6) y que el archivo `.env` tenga bien copiados `SUPABASE_URL` y `SUPABASE_KEY`.
- **La pantalla de login carga pero nada responde** → revisa la terminal donde corriste `npm run dev`; ahí aparece el error exacto.
- **Error al correr `database.sql`** → asegúrate de haber copiado el archivo completo, desde la primera línea (`create extension...`) hasta la última.
