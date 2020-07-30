const Client = require("../model/Client");
const Serveur = require("../model/Serveur");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var mangopay = require("mangopay2-nodejs-sdk");

const api = new mangopay({
  clientId: "ctott",
  clientApiKey: "sPuA8HB9cKzPFFxyyTaNW0rxx7Zp9zmOqynxMp9ocOHKzqeKvM",
  // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
  baseUrl: "https://api.sandbox.mangopay.com/",
});

/* Controller to register; get data of client; login; edit and delete client*/
const clientController = {
  webPayIn: (req, res) => {
    api.PayIns.create(
      {
        AuthorId: "85091885",

        DebitedFunds: {
          Currency: "EUR",
          Amount: 12,
        },
        Fees: {
          Currency: "EUR",
          Amount: 1,
        },
        PaymentType: "CARD",
        ExecutionType: "WEB",
        ReturnURL: "http://www.my-site.com/returnURL",
        CardType: "CB_VISA_MASTERCARD",
        CreditedWalletId: "85043164",
        Culture: "FR",
      },

      (data) => {
        res.json(data);
      }
    );
  },

  /*INSCRIPTION*/
  register: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    const password = req.body.password;

    /* - - - - - Directives pour le mdp - - - - 
                  (?=.?[A-Z]) : Au moins une lettre majuscule  
                  (?=.?[a-z]) : Au moins une lettre anglaise minuscule, 
                  (?=.?[0-9]) : Au moins un chiffre, 
                  (?=.*?[^ws]) : Au moins un caractère spécial, 
                  .{8,} Longueur minimale de huit (avec les ancres)
                            - - - - - - Directives pour le mdp - - - - - - - - */

    if (
      (req.body.gender && typeof req.body.gender != "string") ||
      typeof req.body.lastname != "string" ||
      typeof req.body.firstname != "string" ||
      (req.body.age && typeof req.body.age != "string") ||
      (req.body.adress && typeof req.body.adress != "string") ||
      (req.body.phone && typeof req.body.phone != "string") ||
      cacahuete.test(email) ==
        false /*check de format de saisie de l'email avec RegExp*/
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs obligatoires et respecter le format de saisie.",
      });
    } else if (mdp.test(password) == false) {
      res.status(417);
      res.json({
        message: "Veuillez respecter le format de saisie du mot de passe.",
      });
    } else {
      const hash = bcrypt.hashSync(password, 10); //10= nb de hasch

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
            success: true,
            message:
              "Votre inscription a bien été prise en compte. Un e-mail de confirmation vient de vous être envoyé. Merci.",
          });
        }
      });
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL || "tiptothank@gmail.com",
          pass: process.env.PASSWORD || "tiptothankTTT",
        },
      });

      let mailOptions = {
        from: "tiptothank@gmail.com",
        to: req.body.email,
        subject: "Confirmation de la création de votre compte client",
        html:
          "Félicitations ! Votre compte client Tip To Thank a bien été crée. Merci pour votre confiance !",
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return console.log("Une erreur s'est produite");
        } else {
          return console.log("L'e-mail de validation a bien été envoyé");
        }
      });
    }
  },
  /*Récupération du profil du client connecté*/
  getDataClient: (req, res, next) => {
    delete req.user.password; /*permet de ne pas afficher le password crypté*/
    res.json(req.user); /*on request sous format json les données du client */
  },

  login: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
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
    /**on ne donne pas au client l'option d'editer son email et pwd sinon plus d'authentif id */
    if (
      (req.body.gender && typeof req.body.client.gender != "string") ||
      typeof req.body.client.lastname != "string" ||
      typeof req.body.client.firstname != "string" ||
      (req.body.age && typeof req.body.client.age != "string") ||
      (req.body.adress && typeof req.body.client.adress != "string") ||
      (req.body.phone && typeof req.body.client.phone != "string")
    ) {
      res.status(417);
      res.json({
        message:
          "Veuillez compléter les champs au bon format pour confirmer la modification de votre compte.",
      });
    } else {
      Client.updateOne(
        /*Modif et mise à jour des données de l'user repéré grace a son id */
        {
          _id: req.user._id,

          /*_id: "5f16f25f03bfa2298cf52f2e",*/ // dans le cas que du back
        },
        {
          gender: req.body.client.gender,
          lastname: req.body.client.lastname,
          firstname: req.body.client.firstname,
          age: req.body.client.age,
          adress: req.body.client.adress,
          phone: req.body.client.phone,
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
        _id: req.user._id,
        /*_id: "5f16f25f03bfa2298cf52f2e",*/
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

  getDataServeur: (req, res) => {
    Serveur.find(
      /*Get tout les serveurs de la db serveurs, accolade vide permet de récuper l'Id*/
      {},
      { lastname: 1, firstname: 1, picture: 1 },
      (err, data) => {
        if (err) {
          res.status(500).json({
            message:
              "une erreur s'est produite dans le chargement de la liste des serveurs",
          });
        } else {
          res.json(data);
        }
      }
    );
  },
};

module.exports = clientController;
