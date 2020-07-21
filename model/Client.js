/*Mongoose imports*/

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/* Template schéma correspond à une collection MongoDB et définit la forme des documents au sein de cette collection*/
const ClientSchema = new mongoose.Schema(
  {
    gender: String,
    lastname: String,
    firstname: String,
    password: String,
    age: String,
    adress: String,
    phone: String,
    email: { type: String, unique: true },
    /*check que notre email est bien unique */
    historique: [
      {
        Montant: Number,
        date: Date,
        waiter: String,
        general: String,
        RestaurantName: String,
      },
    ],
    favoris: [{ restaurantName: String, link: String }],
  },
  { collection: "clients" }
);

/*  uniqueValidator verifie que 2 utilisateurs n'ont pas la même adresse mail */
ClientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Client", ClientSchema);
