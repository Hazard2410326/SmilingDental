require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const citaRoutes = require("./routes/citaRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const historiaRoutes = require("./routes/historiaRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const reporteRoutes = require("./routes/reporteRoutes");
const odontologoRoutes = require("./routes/odontologoRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Sirve el frontend (HTML, CSS, JS) que esta en /public
app.use(express.static(path.join(__dirname, "public")));

// Rutas de la API (todas empiezan con /api, ver Capitulo 6.2.1)
app.use("/api/auth", authRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/historias", historiaRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/odontologos", odontologoRoutes);

// Manejador central de errores (seccion 5.6). Va siempre al final.
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SmileTrack corriendo en http://localhost:${PORT}`);
});
