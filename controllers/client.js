const Client = require("../model/Client");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// import mailgun

/* Innscription*/

const clientController = {
  register: (req, res, next) => {
    const mail = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;

    const mdp = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&-]).{8,}$"
    );
    const verife = req.body.password;

    /*Au moins une lettre majuscule lettre anglaise , (?=.?[A-Z])
      Au moins une lettre anglaise minuscule, (?=.?[a-z])
      Au moins un chiffre, (?=.?[0-9])
      Au moins un caractère spécial, (?=.?[#?!@$%^&-])
      Longueur minimale de huit .{8,} (avec les ancres)*/

    /*stockage d'un mot de passe crypté dans la base de données apres le req*/
    //10= nb de hasch
    const hash = bcrypt.hashSync(req.body.password, 10);
    if (
      typeof req.body.gender != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.lastname != "string" ||
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
    } else if (mdp.test(verife) == false) {
      res.status(417);
      res.json({
        message: "mots de passe incorrect",
      });
    } else {
      const newClient = new Client({
        gender: req.body.gender,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        adress: req.body.adress,
        phone: req.body.phone,
        age: req.body.age,
        password: hash,
        email: req.body.email,
      });
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
    const mail = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    console.log(req.body);

    if (
      mail.test(email) == false ||
      typeof req.body.password != "string" /**check des formats emails et pwd */
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
};
module.exports = clientController;
