/* SI TU N'ES PAS ARNAUD OU MARIE TU SORS */

var express = require("express");
var router = express.Router();
var restaurateurController = require("../controllers/restaurateur");

/**
 * APPEL DE ROUTES DE PROFIL
 */

/* Appel du router profil affichage */
router.get("/profil", restaurateurController.getProfil);

/* Appel du router profil affichage */
router.put("/profil/edit", restaurateurController.editProfil);

/* Appel du router de Recupération du QRCODE */
router.get("/profil/qrcode");

/* Appel du router pour le désabonnement */
router.delete("/profil/unsubscribe");

/**
 * APPEL DES ROUTES GESTION DE PERSONNEL
 */

/* Appel du router validation d'affiliation*/
router.post("/management/affiliation");

/* Appel du router pour récupérer la liste server */
router.get("/management/waiter-list", restaurateurController.getWaiterList);

/* Appel du router pour la suppression des serveurs */
router.put("/management/waiter-delete", restaurateurController.deleteWaiter);

/**
 * APPEL DES ROUTES CONNEXION
 */

/*Appel du router pour la connexion */
router.post("/connexion");

module.exports = router;
