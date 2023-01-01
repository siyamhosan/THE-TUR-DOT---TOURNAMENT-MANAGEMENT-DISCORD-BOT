const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  Client,
  EmbedBuilder,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
module.exports = {
  subCommand: "admin.reset",
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
        ephemeral: true,
      });
    if (!turOf) {
      return interaction.editReply({
        embeds: [wrongChannel],
      });
    }
    let groups = turOf.groups_list;
    let newGroupInfoToStore = [];
    turOf.groups_list = newGroupInfoToStore;
    turOf.save();
    interaction.editReply({
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
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL(),
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
