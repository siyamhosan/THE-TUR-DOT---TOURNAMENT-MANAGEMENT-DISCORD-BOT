const { Schema, model } = require("mongoose");

const tournamentSchema = new Schema({
  _id: Schema.Types.ObjectId,
  tur_id: String,
  full: String,
  short: String,
  createdAt: String,
  exprie: String,
  click: Number,
});

module.exports = model("ShortLink", tournamentSchema, "linkShortner");
