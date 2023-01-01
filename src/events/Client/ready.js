const { prefix } = require("../../config.js");
const { ActivityType, Client } = require("discord.js");
const { readFileSync } = require("fs");

module.exports ={
name: "ready",
/**
 * 
 * @param {Client} client 
 */
run: async (client) => {
    client.logger.log(`${client.user.username} online!`, "ready");
    client.logger.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users`, "ready");

    //Game
    let statuses = ['/help', `Prefix ${prefix}`, `With ${client.users.cache.size} Members`];
    setInterval(function() {
  		let status = statuses[Math.floor(Math.random()*statuses.length)];
  		client.user.setActivity(status, {type: ActivityType.Playing});
  	}, 10000)
 }
}
