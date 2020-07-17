const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ClientSchema = new mongoose.Schema({
  gender: String,
  lastname: String,
  firstname: String,
  password: String,
  age: String,
  adress: String,
  phone: Number,
  email: String,
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

ClientSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Client", ClientSchema);
