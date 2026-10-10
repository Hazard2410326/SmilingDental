const express = require("express");
const router = express.Router();
const historiaController = require("../controllers/historiaController");
const { verificarToken, soloRol } = require("../middlewares/authMiddleware");

router.use(verificarToken);
router.post("/", soloRol("odontologo"), historiaController.crear);

module.exports = router;
