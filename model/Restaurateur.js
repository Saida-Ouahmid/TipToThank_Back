const mongoose = require("mongoose");
const menu = new mongoose.Schema({
  dailyMenu: { picture: String, label: String },
  drink: [{ picture: String, label: String }],
  otherMenu: [{ picture: String, label: String }],
});
const restaurateurSchema = new mongoose.Schema({
  restaurantName: String,
  email: String,
  password: String,
  siret: String,
  bossName: String,
  adress: String,
  location: { longitude: String, latitude: String },
  phone: String,
  serviceNumber: { noon: Boolean, evening: Boolean },
  logo: String,
  picture: [],
  menu: [menu],
  qrCode: String,
});

module.exports = mongoose.model("Restaurateur", restaurateurSchema);
