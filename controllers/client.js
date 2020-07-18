const Client = require("../model/Client");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* Controller to register; get data of client; login; edit and delete client*/
const clientController = {
  register: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&-]).{8,}$"
    );
    const password = req.body.password;
    const hash = bcrypt.hashSync(req.body.password, 10); //10= nb de hasch
    /* - - - - - Directives pour le mdp - - - - 
(?=.?[A-Z]) : Au moins une lettre majuscule  
(?=.?[a-z]) : Au moins une lettre anglaise minuscule, 
(?=.?[0-9]) : Au moins un chiffre, 
(?=.?[#?!@$%^&-]) : Au moins un caractère spécial, 
.{8,} Longueur minimale de huit (avec les ancres)*/

    if (
      typeof req.body.gender != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.firstname != "string" ||
      mdp.test(password) ==
        false /*check de format de saisie du pwd avec RegExp*/ ||
      typeof req.body.age != "string" ||
      typeof req.body.adress != "string" ||
      typeof req.body.phone != "string" ||
      cacahuete.test(email) ==
        false /*check de format de saisie de l'email avec RegExp*/
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs obligatoires et respecter le format de saisie.",
      });
    } else {
      const newClient = new Client({
        gender: req.body.gender,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        password: hash /*mdp hashé*/,
        age: req.body.age,
        adress: req.body.adress,
        phone: req.body.phone,
        email: req.body.email,
      });

      /*sauvegarde du nouveau client*/
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

  dataClient: (req, res, next) => {
    delete req.user.password; /*permet de ne pas afficher le password crypté*/
    res.json(req.user); /*on request sous format json les données du user */
  },

  login: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&-]).{8,}$"
    );
    const password = req.body.password;
    console.log(req.body);

    if (
      cacahuete.test(email) == false ||
      mdp.test(password) == false /**check des formats emails et pwd */
    ) {
      res.status(417);
      res.json({
        message:
          "Saisie incorrects. Veuillez ressaisir vos identifiants et mot de passe.",
      });
    } else {
      /*comparaison email user et base de donnée si match ou pas */
      Client.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "une erreur s'est produite",
          }); /*erreur de saisie ou autre err*/
        } else if (!data) {
          res.status(401).json({
            message:
              "Identifiant de connexion incorrect." /*donnée ne matche pas avec database*/,
          });
        } else {
          /* quand utilisateur enfin ok => comparaison password avec bcrypt */
          bcrypt.compare(req.body.password, data.password, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).json({
                message: "Une erreur s'est produite.",
              }); /*erreur de saisie ou autre err*/
            } else if (!result) {
              res.status(401).json({
                message:
                  "Mot de passe incorrect." /*password ne matche pas avec database*/,
              });
            } else {
              res.status(200).json({
                userId: data._id,
                token: jwt.sign({ userId: data._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                  /*durée de validité du Token, l'utilisateur devra se reconnecter au bout de 24h*/
                }),
                message: "Connexion Réussie !" /*good password */,
              });
            }
          });
        }
      });
    }
  },
  edit: (req, res, next) => {
    console.log(req.body);
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&-]).{8,}$"
    );
    const password = req.body.password;
    if (
      typeof req.body.gender != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.password != "string" ||
      (req.body.age && typeof req.body.age != "string") ||
      typeof req.body.adress != "string" ||
      (req.body.phone && typeof req.body.phone != "string") ||
      cacahuete.test(email) == false
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs au bon format pour confirmer la modification de votre compte.",
      });
    } else {
      Client.updateOne(
        /*Modif et mise à jour des données l'user repéré grace a son id */
        {
          /* _id: req.user._id,*/ _id: "5f11b63f6b9d89398e113c30",
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

module.exports = clientController;
