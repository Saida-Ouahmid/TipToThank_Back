/* SI TU N'ES PAS ILIAS OU SAIDA TU SORS */

var express = require("express");
var router = express.Router();

/*route for users infos*/
const clientController = require("../controllers/client");
/*const authentification = require("../middlewares/authentif");*/

/* PUT profil edit.*/
router.put("/edit", /*authentification,*/ clientController.edit);

/* DELETE profil delete.*/
router.delete("/delete", /*authentification,*/ clientController.delete);

module.exports = router;
