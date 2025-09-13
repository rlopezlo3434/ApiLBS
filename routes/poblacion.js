const express = require("express");
const router = express.Router();
const poblacionController = require("../controllers/poblacionController");

router.get("/", poblacionController.obtenerCPP);
router.get("/pet", poblacionController.obtenerCPP_PET);
router.get("/pea_nopea", poblacionController.obtenerPEA_NOPEA);


// router.post("/", poblacionController.crearUsuario);

module.exports = router;
