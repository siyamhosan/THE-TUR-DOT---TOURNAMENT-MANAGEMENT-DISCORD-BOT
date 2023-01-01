const {
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
  Message,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
module.exports = {
  name: "groupreset",
  aliases: ["greset"],
  category: "Group",
  description: "Reset All Group And Role",
  args: false,
  usage: "",
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    const turOf = await turOfDB
      .findOne({ tur_manage: message.channelId })
      .catch((e) => console.log(e));
    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else
      return message.reply({
        embeds: [notAdminMessage],
        ephemeral: true,
      });
    if (!turOf) {
      return message.reply({
        embeds: [wrongChannel],
      });
    }
    let groups = turOf.groups_list;
    let newGroupInfoToStore = [];
    turOf.groups_list = newGroupInfoToStore;
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Reseted All Groups.")
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
    await client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
          })
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Reseted All Groups.")
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  },
};
