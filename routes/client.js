/* SI TU N'ES PAS ILIAS OU SAIDA TU SORS */

var express = require("express");
var router = express.Router();
const clientController = require("../controllers/client");


/* Post Inscription client */
router.post("/register", clientController.register);

module.exports = router;
