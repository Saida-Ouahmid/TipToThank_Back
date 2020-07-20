const Restaurateur = require("../model/Restaurateur");
const Serveur = require("../model/Serveur");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const restaurateurController = {
  /**
   * PARTIE MENU
   */

  /*Afficher les menus*/
  getMenu: (req, res, next) => {
    Restaurateur.find({ _id: req.user._id }, "menu", (err, data) => {
      if (err) {
        res.status(500).send("Une erreur s'est produite");
        return;
      }
      res.json(data);
    });
  },

  /*Ajouter les menus*/
  addMenu: (req, res, next) => {
    Restaurateur.updateOne(
      { _id: req.user._id },
      {
        $push: {
          "menu.otherMenu": [
            {
              picture: req.body.picture,
              label: req.body.label,
              value: req.body.value,
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
    console;
  },

  /*Supprimer les menus*/
  deleteMenu: (req, res, next) => {
    Restaurateur.updateOne(
      { _id: req.user._id },
      {
        $pull: {
          "menu.otherMenu": {
            label: req.body.label,
          },
        },
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

  /*Ajouter le menu du jour */
  addDailyMenu: (req, res, next) => {
    console.log(req.file.path);

    const filePath = req.file.path.replace("public", "");
    Restaurateur.updateOne(
      { restaurantName: "test1" },
      {
        $set: {
          "menu.dailyMenu": {
            picture: filePath,
            label: "Test1",
          },
        },
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

  /**
   * PARTIE PROFIL
   */

  /*Inscription*/
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
      /*TEST ENVOI MAIL*/
      let rand = new Array(10).fill("").reduce(
        (accumulator) =>
          accumulator +
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, "")
            .substr(0, 5)
      );
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
        confirmed: false,
        verificationId: rand,
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
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL || "tiptotest@gmail.com",
          pass: process.env.PASSWORD || "!TTTmdp51!",
        },
      });

      link = "http://localhost:3000/restaurateur/verify?id=" + rand;
      let mailOptions = {
        from: "tiptotest@gmail.com",
        to: req.body.email,
        subject: "Nodemailer - Test",
        html: "Wooohooo it works!!:<a href=" + link + ">Clique</a>",
      };

      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return console.log("Error occurs");
        }
        return console.log("Email sent!!!");
      });
    }
  },

  verify: (req, res, next) => {
    if (!req.query.id) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    Restaurateur.updateOne(
      { verificationId: req.query.id },
      { $set: { confirmed: true, verificationId: null } },
      (err, result) => {
        if (err) {
          res.status(417).json({ message: "erreur" });
          return;
        }
        if (result.nModified == 0) {
          res.status(404).json({ message: "Not found" });
          return;
        }
        res.json({ message: "Email is been Successfully verified" });
        console.log(result);
      }
    );
  },

  /*Récupération du profil du restaurateur connecté*/
  getProfil: (req, res) => {
    res.json(req.user);
    /*permet de ne pas afficher le password crypté*/
  },

  /*Modification du profil du restaurateur connecté*/
  editProfil: (req, res, next) => {
    const emailVerif = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    if (
      typeof req.body.restaurantName != "string"
      /*typeof req.body.email != "string" ||
      typeof req.body.bossName != "string" ||
      typeof req.body.adress != "string " ||
      (req.body.phone && typeof req.body.phone != "string") ||
      typeof req.body.logo != "string " ||
      emailVerif.test(email) == false*/
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
          _id: req.user.id,
        },
        {
          restaurantName: req.body.restaurantName,
          email: req.body.email,
          phone: req.body.phone,
          bossName: req.body.bossName,
          logo: req.body.logo,
          adress: req.body.adress,
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

  /**
   * LOGIN MOT DE PASSE
   */

  login: (req, res, next) => {
    const verifEmail = RegExp("([A-z]|[0-9])+@([A-z]|[0-9])+.[A-z]{2,3}");
    const email = req.body.email;
    console.log(req.body);

    if (
      verifEmail.test(email) == false ||
      typeof req.body.password != "string" /**check des formats emails et pwd */
    ) {
      res.status(417);
      res.json({
        message:
          "Saisie incorrects. Veuillez ressaisir vos identifiants et mot de passe.",
      });
    } else if (Restaurateur.confirmed == false) {
      res.status(417).json({
        message:
          "Veuillez confirmer votre adresse e-mail pour pouvoir vous connecter",
      });
    } else {
      /*comparaison email user et base de donnée si match ou pas */
      Restaurateur.findOne({ email: req.body.email }, (err, data) => {
        bcrypt.compare(req.body.password, data.password, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: "une erreur s'est produite",
            }); /*erreur de saisie ou autre err*/
          } else if (!data || !result) {
            res.status(401).json({
              message:
                "Identifiant et/ou Mot de passe incorrects" /*donnée ne matche pas avec database*/,
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
      });
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
      { _id: req.body._id },
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
