require("dotenv").config();

module.exports = {
  token: process.env.TOKEN || "", // your bot token
  clientID: process.env.CLIENT_ID || "", // your bot client id
  prefix: process.env.PREFIX || "?", // bot prefix
  ownerID: process.env.OWNER_ID || "", //your discord id
  mongourl: process.env.DATABASETTOKEN || "", // MongoDb URL
  embedColor: process.env.EMBED_COLOR || 0xf96819, // embed colour
  logs: process.env.LOGS || "", // channel id for guild create and delete logs
  errorLogsChannel: process.env.ERROR_LOGS_CHANNEL || "", //error logs channel id
  links: {
    support: process.env.SUPPORT || "https://discord.gg/NcmUvd22pd", //support server invite link
    invite: process.env.INVITE || "", //bot invite link
  },
};

function parseBoolean(value) {
  if (typeof value === "string") {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case "true":
      return true;
    default:
      return false;
  }
}
