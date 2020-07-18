const Client = require("../model/Client");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = clientController;
