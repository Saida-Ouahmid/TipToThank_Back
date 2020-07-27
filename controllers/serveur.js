const Serveur = require("../model/Serveur");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/* Controller to register; get data of serveur; login; edit and delete serveur*/
const serveurController = {
  /*INSCRIPTION*/
  register: (req, res, next) => {
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    const password = req.body.password;
    const hash = bcrypt.hashSync(req.body.password, 10); //10= nb de hasch

    /* - - - - - Directives pour le mdp - - - - 
                  (?=.?[A-Z]) : Au moins une lettre majuscule  
                  (?=.?[a-z]) : Au moins une lettre anglaise minuscule, 
                  (?=.?[0-9]) : Au moins un chiffre, 
                  (?=.*?[^ws]) : Au moins un caractère spécial, 
                  .{8,} Longueur minimale de huit (avec les ancres)
                            - - - - - - Directives pour le mdp - - - - - - - - */

    if (
      typeof req.body.city != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.date != "string" ||
      typeof req.body.adress != "string" ||
      typeof req.body.staff != "string" ||
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
      const newServeur = new Serveur({
        city: req.body.city,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        password: hash /*mdp hashé*/,
        date: req.body.date,
        adress: req.body.adress,
        phone: req.body.phone,
        email: req.body.email,
        staff: req.body.staff,
      });

      /*sauvegarde du nouveau Serveur*/
      newServeur.save((err) => {
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
        subject: "Nodemailer - Test",
        html: "Felicitation votre compte serveur à bien été crée !",
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return console.log("Error occurs");
        }
        return console.log("Email sent!!!");
      });
    }
  },

  /*Récupération du profil du serveur connecté*/

  getServeur: (req, res, next) => {
    delete req.user.password; /*permet de ne pas afficher le password crypté*/
    res.json(req.user); /*on request sous format json les données du serveur */
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
      Serveur.findOne({ email: req.body.email }, (err, data) => {
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
    const cacahuete = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    const mdp = RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    const password = req.body.password;
    if (
      typeof req.body.city != "string" ||
      typeof req.body.lastname != "string" ||
      typeof req.body.firstname != "string" ||
      typeof req.body.staff != "string" ||
      mdp.test(password) == false ||
      (req.body.date && typeof req.body.date != "string") ||
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
      Serveur.updateOne(
        /*Modif et mise à jour des données l'user repéré grace a son id */
        {
          /* _id: req.user._id,*/

          _id: "5f18130fd733700fa02869e2",
        },
        {
          city: req.body.city,
          lastname: req.body.lastname,
          firstname: req.body.firstname,
          password: req.body.password,
          adress: req.body.adress,
          phone: req.body.phone,
          email: req.body.email,
          staff: req.body.staff,
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
    Serveur.deleteOne(
      {
        /*_id: req.user._id,*/
        _id: "5f1708de751b5a4b3c208b0f",
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

module.exports = serveurController;
