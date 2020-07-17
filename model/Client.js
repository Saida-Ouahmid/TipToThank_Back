const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Client", clientSchema);
