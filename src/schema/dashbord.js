const { Schema, model } = require("mongoose");

const dashBordScmas = new Schema({
  _id: Schema.Types.ObjectId,
  userID: String,
  access_token: String,
  refresh_token: String,
  exprires_in: String,
  secretAcceseeKey: String,
  user: {
    id: String,
    username: String,
    discriminator: String,
    avatar: String,
  },
  lastUpdate: {
    type: Number,
    default: Date.now(),
  },
});

module.exports = model("Website", dashBordScmas, "DashBord");
