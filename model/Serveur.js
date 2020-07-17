const mongoose = require("mongoose");
const serveurSchema = new mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
  date: Date,
  birthPlace: String,
  phone: String,
  staff: String,
  picture: String,
  restaurantName: String,
});

module.exports = mongoose.model("Serveur", serveurSchema);
