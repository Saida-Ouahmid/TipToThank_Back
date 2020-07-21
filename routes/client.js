/* SI TU N'ES PAS ILIAS OU SAIDA TU SORS */

var express = require("express");
var router = express.Router();
const clientController = require("../controllers/client");
const authentification = require("../middlewares/authentif");

/* Post Inscription client */
router.post("/register", clientController.register);

router.post("/dataProfil", authentification, clientController.dataClient);

/* POST profil login. */
router.post("/login", clientController.login);

module.exports = router;
