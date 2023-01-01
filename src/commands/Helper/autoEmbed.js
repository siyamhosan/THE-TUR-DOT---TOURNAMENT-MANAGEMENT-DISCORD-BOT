const {
  Message,
  Client,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "autoembed",
  category: "Moderation",
  aliases: ["automessage", "autoembb"],
  description: "Toggle Auto Embed Message",
  args: false,
  usage: "",
  userPerms: [PermissionFlagsBits.Administrator],
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    const storeOfDB = require("../../schema/storeofSMAS");
    let storeOf = await storeOfDB.findOne({ guildID: message.guildId });
    if (!storeOf) return;
    if (message.author.bot) return;
    let messageData;
    //add or remove auto embb

    if (storeOf.autoEmbed.includes(message.author.id)) {
      var userIndex = storeOf.autoEmbed.indexOf(message.author.id);
      storeOf.autoEmbed.splice(userIndex, 1);
      message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Truned Off Auto Embed")
              .setColor(0xff831f)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          msg.delete();
        });
    } else {
      storeOf.autoEmbed.push(message.author.id);
      message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Truned On Auto Embed")
              .setColor(0xff831f)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          msg.delete();
        });
    }
    storeOf.save();
    message.delete();
  },
};
