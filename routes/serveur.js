/* SI TU N'ES PAS LAMBERT OU WENDY TU SORS */

var express = require("express");
var router = express.Router();

/*route for serveur infos*/
const serveurController = require("../controllers/serveur");
const authentification = require("../middlewares/authentif");

/* POST Inscription serveur */
router.post("/register", serveurController.register);
/*verification de l'email*/
router.get("/verify", serveurController.verify);

router.post("/dataProfil", authentification, serveurController.dataServeur);

/* POST profil login. */
router.post("/login", serveurController.login);
/* PUT serveur edit.*/
router.put("/edit", authentification, serveurController.edit);
/* DELETE serveur delete.*/

router.delete("/delete", authentification, serveurController.delete);

module.exports = router;
