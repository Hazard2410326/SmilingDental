const express = require("express");
const router = express.Router();
const odontologoModel = require("../models/odontologoModel");
const { verificarToken } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, async (req, res, next) => {
  try {
    const odontologos = await odontologoModel.listar();
    res.json({ odontologos });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
