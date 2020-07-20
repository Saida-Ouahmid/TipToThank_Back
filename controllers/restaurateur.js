const Restaurateur = require("../model/Restaurateur");
const Serveur = require("../model/Serveur");

const restaurateurController = {
  /**
   * PARTIE PROFIL
   */

  /*Récupération du profil du restaurateur connecté*/
  getProfil: (req, res) => {
    Restaurateur.find({}, "lastname firstname staff", (err, data) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(data);
      }
    });
    /*res.json(req.user);*/
  },

  /*Modification du profil du restaurateur connecté*/
  editProfil: (req, res, next) => {
    const emailVerif = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    if (
      typeof req.body.restaurantName != "string" ||
      typeof req.body.email != "string" ||
      typeof req.body.bossName != "string" ||
      typeof req.body.adress != "string " ||
      (req.body.phone && typeof req.body.phone != "string") ||
      typeof req.body.logo != "string " ||
      emailVerif.test(email) == false
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs au bon format pour confirmer la modification de votre profil.",
      });
    } else {
      Restaurateur.updateOne(
        /*Modif et mise à jour des données l'user repéré grace a son id */
        {
          _id: "5f11bb086b9d89398e118d4c",
        },
        {
          restaurantName: req.body.restaurantName,
          email: req.body.email,
          phone: req.body.phone,
        },
        (err) => {
          if (err) {
            console.log(err);
            res.json({ message: "une erreur s'est produite" });
          } else {
            res.json({
              message:
                "Vos modifications ont bien été prises en compte. Merci.",
            });
          }
        }
      );
    }
  },

  /*Récupération du QR code */
  getQRCODE: (req, res) => {
    res.json(req.user.qrCode);
  },

  /*Désabonnement (à voir avec MangoPay)*/
  unsubscribe: () => {},

  /**
   * PARTIE GESTION PERSONNEL
   */
  /* A VOIR AVEC WENDY/LAMBERT*/
  validAffiliation: () => {},

  /*Récupération de la liste des serveurs*/
  getWaiterList: (req, res) => {
    Serveur.find({}, "lastname firstname staff", (err, data) => {
      if (err) {
        res.status(500).end();
      } else {
        res.json(data);
      }
    });
  },
  /*Suppression d'un serveur de son restaurant*/
  deleteWaiter: (req, res) => {
    Serveur.updateOne(
      { _id: "5f11c96d6b9d89398e1294a4" },
      { $unset: { restaurantName: "" } },
      (err, data) => {
        if (err) {
          res.status(500).end();
        } else {
          res.json({ message: "Le serveur a bien été supprimé du restaurant" });
        }
      }
    );
  },
};

module.exports = restaurateurController;
