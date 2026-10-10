const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController");
const { verificarToken, soloRol } = require("../middlewares/authMiddleware");

router.use(verificarToken);

router.get("/", citaController.listar);
router.post("/", soloRol("recepcionista"), citaController.crear);
router.put("/:id", soloRol("recepcionista"), citaController.actualizar);
router.put("/:id/cancelar", soloRol("recepcionista"), citaController.cancelar);

module.exports = router;
