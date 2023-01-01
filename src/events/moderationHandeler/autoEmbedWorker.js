const { Client, Message, Events,EmbedBuilder } = require("discord.js");
const storeOfDB = require("../../schema/storeofSMAS");
module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async(client, message) => {
    let storeOf = await storeOfDB.findOne({
      guildID: message.guildId,
    });
    if(!storeOf) return
    let autoRolers = storeOf.autoEmbed;
    if (!autoRolers) return;
    if (autoRolers.includes(message.author.id)) {
      let content = message.content;
      if (content.toLowerCase() === "ig?autoembb") return;
      let embed = new EmbedBuilder()
        .setColor(0xff7519)
        .setTimestamp()
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        });

      if (content.includes("$$")) {
        let title = message.content.split("$$")[0];
        let des = message.content.split("$$")[1];
        embed.setTitle(title).setDescription(des);
      } else {
        embed.setDescription(message.content);
      }
      if (message.attachments)
        embed.setImage(message.attachments.map((z) => z.proxyURL)[0]);
      message.delete();
      message.channel.send({ embeds: [embed] });
    }
  },
};
