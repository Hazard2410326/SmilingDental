const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");
const { verificarToken, soloRol } = require("../middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", pacienteController.listar);
router.post("/", soloRol("recepcionista"), pacienteController.crear);
router.put("/:id", soloRol("recepcionista"), pacienteController.actualizar);
router.get("/:id/historial", pacienteController.verHistorial);

module.exports = router;
