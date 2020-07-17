const Client = require("../model/Client");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Innscription*/

const clientController = {
  register: (req, res, next) => {
    const mail = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;

    const mdp = RegExp(
      "^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&-]).{8,}$"
    );
    const password = req.body.password;

    /*Au moins une lettre majuscule lettre anglaise , (?=.?[A-Z])
Au moins une lettre anglaise minuscule, (?=.?[a-z])
Au moins un chiffre, (?=.?[0-9])
Au moins un caractère spécial, (?=.?[#?!@$%^&-])
Longueur minimale de huit .{8,} (avec les ancres)*/

    /*stockage d'un mot de passe crypté dans la base de données apres le req*/
    //const hash = bcrypt.hashSync(req.body.password, 10); //10= nb de hasch

    if (
      typeof req.body.gender != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.lastname != "string" ||
      // mdp.test(password) == false ||
      typeof req.body.age != "string" ||
      typeof req.body.adress != "string" ||
      typeof req.body.phone != "string" ||
      /*check de format de saisie de l'email avec RegExp*/
      mail.test(email) == false
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs obligatoires et respecter le format de saisie.",
      });
    } else {
      const newClient = new Client({
        gender: req.body.gender,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        adress: req.body.adress,
        phone: req.body.phone,
        email: req.body.email,
        //password: hash /*mdp hashé*/,
      });

      /*sauvegarde du nouveau profil*/
      newClient.save((err) => {
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
module.exports = clientController;
