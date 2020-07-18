const Client = require("../model/Client");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

<<<<<<< HEAD
const clientController = {
  dataProfil: (req, res, next) => {
    delete req.user.password; /*permet de ne pas afficher le password crypté*/
    res.json(req.user); /*on request sous format json les données du user */
  },

  edit: (req, res, next) => {
    console.log(req.body);
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    if (
      typeof req.body.gender != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.password != "string" ||
      (req.body.age && typeof req.body.age != "string") ||
      typeof req.body.adress != "string" ||
      (req.body.phone && typeof req.body.phone != "string") ||
      cacahuete.test(email) == false
=======
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
>>>>>>> 353cc2259abbca1744923a753b22ad4c838a3762
    ) {
      res.status(417);
      res.json({
        message:
<<<<<<< HEAD
          "Veuillez compléter les champs au bon format pour confirmer la modification de votre compte.",
      });
    } else {
      Client.updateOne(
        /*Modif et mise à jour des données l'user repéré grace a son id */
        {
          /* _id: req.user._id,*/
          _id: "5f11b63f6b9d89398e113c30",
        },
        {
          gender: req.body.gender,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          age: req.body.age,
          adress: req.body.adress,
          phone: req.body.phone,
          email: req.body.email,
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

  delete: (req, res, next) => {
    Client.deleteOne(
      {
        /*_id: req.user._id,*/
        _id: "5f11b63f6b9d89398e113c30",
      },
      (err) => {
        if (err) {
          console.log(err);
          res.json({ message: "une erreur s'est produite" });
        } else {
          res.json({
            message:
              "La suppression de votre compte a bien été prise en compte. Merci.",
          });
        }
      }
    );
  },
};

=======
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
>>>>>>> 353cc2259abbca1744923a753b22ad4c838a3762
module.exports = clientController;
