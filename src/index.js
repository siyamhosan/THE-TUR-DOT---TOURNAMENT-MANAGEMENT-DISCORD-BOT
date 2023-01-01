const TheTurBOT = require("./structures/Client");
const client = new TheTurBOT();

client.connect();
module.exports = client;
