const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");

module.exports = {
  name: "reglimit",
  aliases: ["regslot", "regslots"],
  category: "Registration",
  description: "Change Tournament Slots",
  args: false,
  usage: "",
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: message.channel.parentId,
    });

    if (!turOf) {
      message.reply({
        embeds: [wrongChannel],
      });
    }
    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return message.reply({
        embeds: [notAdminMessage],
      });
    }
    let slotNumber;
    try {
      slotNumber = parseInt(args[0]);
      if (!slotNumber) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Please provide a number of slot!\n\`${prefix}reglimit <slots number>\``
              )
              .setColor(client.wrongColor),
          ],
        });
      }
    } catch (e) {
      if (e)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Please provide a number of slot!\n\`${prefix}reglimit <slots number>\``
              )
              .setColor(client.wrongColor),
          ],
        });
    }
    turOf.reg_limit = slotNumber;
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Registration slot is now: " + slotNumber)
          .setColor(client.successColor)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  },
};
