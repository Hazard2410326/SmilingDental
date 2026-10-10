const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const { verificarToken, soloRol } = require("../middlewares/authMiddleware");

router.post("/consulta", chatbotController.consultar);

router.get("/preguntas", verificarToken, soloRol("administrador"), chatbotController.listarPreguntas);
router.post("/preguntas", verificarToken, soloRol("administrador"), chatbotController.crearPregunta);
router.put("/preguntas/:id", verificarToken, soloRol("administrador"), chatbotController.actualizarPregunta);

module.exports = router;
