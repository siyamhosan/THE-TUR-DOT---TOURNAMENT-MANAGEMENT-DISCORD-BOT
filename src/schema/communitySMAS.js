const { Schema, model } = require("mongoose");

const communityModel = new Schema({
  _id: Schema.Types.ObjectId,
  communityName: String,
  communityDescription: String,
  communityLogo: String,
  mainGuildID: String,
  mainGuildName: String,
  subGuildIDs: Array,
  mainChannels: {
    parent: String,
    manage: String,
    welcome: String,
    chat: String,
    announcement: String,
    tournament: String,
    bans: String,
    infos: String,
  },
  subGuilds: [
    {
      name: String,
      id: String,
      parent: String,
      welcome: String,
      chat: String,
      announcement: String,
      tournament: String,
    },
  ],
  banList: Array,
});

module.exports = model("Community", communityModel, "Community");
