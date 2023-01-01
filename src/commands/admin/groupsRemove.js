const {
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
  Message,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  name: "groupremove",
  aliases: ["gremove", "gdel", "groupdelete"],
  category: "Group",
  description: "Delete A Group And Role",
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
      });
    if (!turOf) {
      return message.reply({
        embeds: [wrongChannel],
      });
    }
    let groups = turOf.groups_list;
    let groupNAME = args[0];
    if (!groupNAME)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Please ping the role to add, @role!\n\`${prefix}groupremove <group Name> <Group Role>\``
            )
            .setColor(client.wrongColor),
        ],
      });
    let newGroupInfoToStore = [];
    if (groups.map((x) => x.group_name).includes(groupNAME.toUpperCase())) {
    } else
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error! <a:tur_error:1032255870567993364>")
            .setDescription("**No Group Found On This Name**")
            .setColor(0xea4819)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    groups.forEach((x) => {
      if (x.group_name === groupNAME.toUpperCase()) return;
      return newGroupInfoToStore.push(x);
    });
    turOf.groups_list = newGroupInfoToStore;
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Deleted Group.")
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
          .setDescription("Successfully Deleted Group.")
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
