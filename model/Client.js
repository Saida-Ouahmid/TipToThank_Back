const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

<<<<<<< HEAD
/* Template schéma correspond à une collection MongoDB et définit la forme des documents au sein de cette collection*/

=======
>>>>>>> 353cc2259abbca1744923a753b22ad4c838a3762
const ClientSchema = new mongoose.Schema({
  gender: String,
  lastname: String,
  firstname: String,
  password: String,
  age: String,
  adress: String,
  phone: String,
  email: { type: String, unique: true },
  /*check que notre email est bien unique */
  Historique: [
    {
      Montant: Number,
      date: Date,
      waiter: String,
      general: String,
      RestaurantName: String,
    },
  ],
  favoris: [{ restaurantName: String, link: String }],
});

<<<<<<< HEAD
/*  uniqueValidator verifie que 2 utilisateurs n'ont pas la même adresse mail */
=======
>>>>>>> 353cc2259abbca1744923a753b22ad4c838a3762
ClientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Client", ClientSchema);
