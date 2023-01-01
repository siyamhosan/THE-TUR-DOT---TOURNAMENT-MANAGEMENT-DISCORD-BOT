const {
  Client,
  Message,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const storeOFDB = require("../../schema/storeofSMAS");
module.exports = {
  name: "clear",
  category: "Moderation",
  aliases: ["msgclear", "messageclear"],
  description: "Delete Messages From channel",
  args: false,
  usage: "<number of message>",
  userPerms: [PermissionFlagsBits.ManageMessages],
  owner: false,
  execute: async (message, args, client, prefix) => {
    try {
      let messageData = args[0];
      let storeOf = await storeOFDB.findOne({
        guildID: message.guildId,
      });
      if (message.author.bot) return;

      if (!/d/g.test(messageData)) {
        messageData = parseInt(messageData.replace(/\D/g, " ").trim());
      } else
        return message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Must include a digit of messages")
                .setColor(0xff0000)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
          })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            msg.delete();
          });
      if (messageData >= 100) {
        message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sorry!")
                .setDescription(
                  "You can not delete more then 100 message at same time with discord bot!!"
                ),
            ],
          })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            msg.delete();
          });
      }
      try {
        await message.channel.bulkDelete(messageData + 1);
      } catch (e) {
        throw e;
      }
      message.channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle(`Deleted ${messageData} Messages From this Channel`)
              .setColor(0xff0000)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          msg.delete();
        });
    } catch (e) {
      if (e.code === "10008") {
        message.channel
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Sorry!")
                .setDescription(
                  "You can not delete a message older then 14 days with discord bot!!"
                ),
            ],
          })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            msg.delete();
          });
        throw e;
      }
    }
  },
};
