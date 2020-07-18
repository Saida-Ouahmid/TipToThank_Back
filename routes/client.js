/* SI TU N'ES PAS ILIAS OU SAIDA TU SORS */

var express = require("express");
var router = express.Router();
const clientController = require("../controllers/client");

<<<<<<< HEAD
/*route for users infos*/
const clientController = require("../controllers/client");
/*const authentification = require("../middlewares/authentif");*/

/* PUT profil edit.*/
router.put("/edit", /*authentification,*/ clientController.edit);

/* DELETE profil delete.*/
router.delete("/delete", /*authentification,*/ clientController.delete);
=======

/* Post Inscription client */
router.post("/register", clientController.register);
>>>>>>> 353cc2259abbca1744923a753b22ad4c838a3762

module.exports = router;
