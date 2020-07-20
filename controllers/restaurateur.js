const Restaurateur = require("../model/Restaurateur");
const Serveur = require("../model/Serveur");
const bcrypt = require("bcrypt");

const restaurateurController = {
  getMenu: (req, res, next) => {
    Restaurateur.find({}, "menu", (err, data) => {
      if (err) {
        res.status(500).send("Une erreur s'est produite");
        return;
      }
      res.json(data);
    });
  },

  addMenu: (req, res, next) => {
    Restaurateur.updateMany(
      { restaurantName: "Chez Lulu" },
      {
        $push: {
          menu: [
            {
              otherMenu: { picture: req.body.picture, label: req.body.label },
            },
          ],
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "Une erreur s'est produite" });
        } else {
          res.json({ message: "Votre nouveau menu a bien été ajouté" });
        }
      }
    );
  },

  editMenu: (req, res, next) => {},

  deleteMenu: (req, res, next) => {
    Restaurateur.updateOne(
      { restaurantName: "Chez Lulu" },
      {
        menu: [
          {
            $pull: {
              drink: { picture: req.body.picture, label: req.body.label },
            },
          },
        ],
      },

      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "une erreur s'est produite" });
        } else {
          res.json({
            message: "Suppression ok",
          });
        }
      }
    );
  },

  addDailyMenu: (req, res, next) => {
    Restaurateur.updateOne(
      { restaurantName: "Chez Lulu" },
      {
        menu: [
          {
            dailyMenu: { picture: req.body.picture, label: req.body.label },
          },
        ],
      },

      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "une erreur s'est produite" });
        } else {
          res.json({
            message: "Photo ok ",
          });
          console.log(req.body.picture);
        }
      }
    );
  },

  inscription: (req, res, next) => {
    const emailVerif = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const passwordVerif = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );

    /*stockage d'un mot de passe crypté dans la base de données apres le req*/
    const hash = bcrypt.hashSync(req.body.password, 10);

    if (
      typeof req.body.restaurantName != "string" ||
      typeof req.body.siret != "string" ||
      typeof req.body.phone != "string" ||
      typeof req.body.bossName != "string" ||
      typeof req.body.adress != "string" ||
      typeof req.body.longitude != "string" ||
      typeof req.body.latitude != "string" ||
      typeof req.body.noon != "boolean" ||
      typeof req.body.evening != "boolean" ||
      emailVerif.test(req.body.email) == false
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs obligatoires et respecter le format de saisie.",
      });
    } else if (passwordVerif.test(req.body.password) == false) {
      res.status(417);
      res.json({
        message:
          "Votre mot de passe doit comporter au minimum 8 caractères dont une minuscule, une majuscule, un chiffre et un caractère spécial.",
      });
    } else {
      const newRestaurateur = new Restaurateur({
        restaurantName: req.body.restaurantName,
        siret: req.body.siret,
        phone: req.body.phone,
        email: req.body.email,
        password: hash /*mdp hashé*/,
        bossName: req.body.bossName,
        adress: req.body.adress,
        location: {
          longitude: req.body.longitude,
          latitude: req.body.latitude,
        },
        serviceNumber: { noon: req.body.noon, evening: req.body.evening },
        logo: req.body.logo,
      });
      newRestaurateur.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            message:
              "L'e-mail saisi est déja lié à un compte. Veuillez vous connecter ou saisir une autre adresse mail.",
          });
        } else {
          res.json({
            message: "Votre inscription a bien été prise en compte. Merci.",
          });
        }
      });
    }
  },
};
module.exports = restaurateurController;
