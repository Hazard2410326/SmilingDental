const express = require("express");
const router = express.Router();
const reporteController = require("../controllers/reporteController");
const { verificarToken, soloRol } = require("../middlewares/authMiddleware");

router.use(verificarToken, soloRol("administrador"));
router.get("/citas", reporteController.citasPorOdontologo);

module.exports = router;
