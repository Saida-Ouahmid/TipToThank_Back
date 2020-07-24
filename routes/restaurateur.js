/* SI TU N'ES PAS ARNAUD OU MARIE TU SORS */

var express = require("express");
var router = express.Router();
const restaurateurController = require("../controllers/restaurateur");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer");

/* Routes Menu */
router.get("/menu", auth, restaurateurController.getMenu);
router.post("/menu/add", auth, restaurateurController.addMenu);

router.delete("/menu/delete", auth, restaurateurController.deleteMenu);
router.put("/dailymenu/add", multer, auth, restaurateurController.addDailyMenu);

/* Routes Inscription */
router.post("/inscription", restaurateurController.inscription);
/*Système de paiement !! */
router.post("/login", restaurateurController.login);
router.get("/verify", restaurateurController.verify);
/**
 * APPEL DE ROUTES DE PROFIL
 */

/* Appel du router profil affichage */
router.get("/profil", auth, restaurateurController.getProfil);

/* Appel du router profil affichage */
router.put("/profil/edit", auth, restaurateurController.editProfil);
router.put("/profil/edit/logo", auth, multer, restaurateurController.getLogo);

/* Appel du router de Recupération du QRCODE */
router.get("/profil/qrcode");

/* Appel du router pour le désabonnement*/

router.delete("/profil/unsubscribe");

/**
 * APPEL DES ROUTES GESTION DE PERSONNEL
 */

/* Appel du router validation d'affiliation*/
router.post("/management/affiliation");

/* Appel du router pour récupérer la liste server */
router.get(
  "/management/waiter-list",
  auth,
  restaurateurController.getWaiterList
);

/* Appel du router pour la suppression des serveurs */
router.put(
  "/management/waiter-delete",
  auth,
  restaurateurController.deleteWaiter
);

/**
 * APPEL DES ROUTES CONNEXION
 */

/*Appel du router pour la connexion */
router.post("/connexion");

module.exports = router;
