/* SI TU N'ES PAS ARNAUD OU MARIE TU SORS */

var express = require("express");
var router = express.Router();
const restaurateurController = require("../controllers/restaurateur");

/* Routes Menu */
router.get("/menu", restaurateurController.getMenu);
router.post("/menu/add", restaurateurController.addMenu);
router.put("/menu/edit", restaurateurController.editMenu);
router.delete("/menu/delete", restaurateurController.deleteMenu);
router.put("/dailymenu/add", restaurateurController.addDailyMenu);

/* Routes Inscription */
router.post("/inscription", restaurateurController.inscription);
/*Système de paiement !! */

module.exports = router;
