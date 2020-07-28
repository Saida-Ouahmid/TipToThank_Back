const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const serveurSchema = new mongoose.Schema(
  {
    lastname: String,
    firstname: String,
    email: { type: String, unique: true },
    password: String,
    date: String,
    adress: String,
    city: String,
    phone: String,
    staff: String,
    picture: String,
    restaurantName: { id: String, name: String },
    verificationIdAffiliation: String,
  },
  { collection: "serveurs" }
);
serveurSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Serveur", serveurSchema);
