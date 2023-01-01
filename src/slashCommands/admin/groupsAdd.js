const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  subCommand: "admin.add",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const turOf = await turOfDB
      .findOne({ tur_manage: interaction.channelId })
      .catch((e) => console.log(e));
    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    if (!turOf) {
      return interaction.editReply({
        embeds: [wrongChannel],
      });
    }
    let groups = turOf.groups_list;
    if (
      groups
        .map((x) => x.group_name)
        .includes(interaction.options.get("name").value.toUpperCase())
    )
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error! <a:tur_error:1032255870567993364>")
            .setDescription("**Duplicate Group Found On This Name**")
            .setColor(0xea4819)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    let newGroupInfoToStore = {
      group_name: interaction.options.get("name").value.toUpperCase(),
      group_roleId: interaction.options.get("role").value,
    };
    let newGroupData = groups.push(newGroupInfoToStore);
    turOf.group_status = true;
    turOf.groups_list = newGroupData;
    turOf.save();
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Added Group.")
          .addFields({
            name: "Group Information",
            value: `<a:animated_arrow:1024306395740385351>**GROUP: ${interaction.options
              .get("name")
              .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> ROLE: <@&${
              interaction.options.get("role").value
            }>`,
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
              .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **ROLE: <@&${
              interaction.options.get("role").value
            }>`,
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
