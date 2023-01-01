const {
  ChatInputCommandInteraction,
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
  name: "groupadd",
  aliases: ["gadd"],
  category: "Group",
  description: "Add A New Group And Role",
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
    let groupNAME = args[0];
    let groupROLE =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    if (!groupROLE)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Please ping the role to add, @role!\n\`${prefix}groupadd <group Name> <Group Role>\``
            )
            .setColor(client.wrongColor),
        ],
      });

    let groups = turOf.groups_list;
    if (groups.map((x) => x.group_name).includes(groupNAME.toUpperCase()))
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Sorry! <a:tur_error:1032255870567993364>")
            .setDescription(
              "**Someone already used this name to create a Group.**\n\n**Duplicate Group Found On This Name**"
            )
            .setColor(0xea4819)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    let newGroupInfoToStore = {
      group_name: groupNAME.toUpperCase(),
      group_roleId: groupROLE,
    };
    let newGroupData = groups.push(newGroupInfoToStore);
    turOf.group_status = true;
    turOf.groups_list = newGroupData;
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Added Group.")
          .addFields({
            name: "Group Information",
            value: `<a:animated_arrow:1024306395740385351>**GROUP: ${interaction.options
              .get("name")
              .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> ROLE: <@&${groupROLE}>`,
          })
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
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Added Group.")
          .addFields({
            name: "Group Information",
            value: `<a:animated_arrow:1024306395740385351>**GROUP: ${interaction.options
              .get("name")
              .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **ROLE: <@&${groupROLE}>`,
          })
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
