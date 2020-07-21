/* SI TU N'ES PAS ILIAS OU SAIDA TU SORS */

var express = require("express");
var router = express.Router();

/*route for client infos*/
const clientController = require("../controllers/client");
const authentification = require("../middlewares/authentif");

/* POST Inscription client */
router.post("/register", clientController.register);

router.post("/getDataClient", authentification, clientController.getDataClient);

/* POST profil login. */
router.post("/login", clientController.login);
/* PUT client edit.*/
router.put("/edit", /*authentification*/ clientController.edit);
/* DELETE client delete.*/

router.delete("/delete", /*authentification*/ clientController.delete);

module.exports = router;
