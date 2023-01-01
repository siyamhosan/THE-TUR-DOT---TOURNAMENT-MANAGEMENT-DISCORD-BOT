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
  subCommand: "admin.delete",
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
    let newGroupInfoToStore = [];
    if (
      groups
        .map((x) => x.group_name)
        .includes(interaction.options.get("name").value)
    ) {
    } else
      return interaction.editReply({
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
      if (x.group_name === interaction.options.get("name").value.toUpperCase())
        return;
      return newGroupInfoToStore.push(x);
    });
    turOf.groups_list = newGroupInfoToStore;
    turOf.save();
    interaction.editReply({
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
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
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
