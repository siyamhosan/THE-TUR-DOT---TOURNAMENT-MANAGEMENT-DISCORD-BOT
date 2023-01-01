const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  name: "regend",
  aliases: ["registrationend"],
  category: "Registration",
  description: "End registration of this tournament",
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
      return message.reply({
        ephemeral: true,
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

    turOf.reg_status = "ended";
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Registration status is now: Started")
          .setColor(client.successColor)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });

    await client.channels.cache.get(turOf.reg_channel).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Registration Ended!")
          .setDescription(
            `Total Slots: ${turOf.reg_limit}\nSlots Available: ${
              turOf.reg_limit - turOf.reg_list.length
            }\n\nTry Again Next Time <a:tur_blt:1034733773817909308>`
          )
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setImage(turOf.tur_benner ?? null)
          .setColor(client.successColor),
      ],
    });
  },
};
