const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "result.reset",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();

    if (interaction.user.bot) return;
    let messageData;

    const turOfDB = require("../../schema/turnamentSMAS");
    const storeOfDB = require("../../schema/storeofSMAS");
    let turOf = await turOfDB
      .findOne({ tur_pretent: interaction.channel.parentId })
      .catch(console.error);
    let storeOf = await storeOfDB.findOne({ guildID: interaction.guildId });
    //Prosses Started Message
    if (!turOf) return interaction.editReply({ embeds: wrongChannel });

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    //get and delete
    let matchResultsData = turOf.result_matchs;

    matchResultsData.forEach((x) => {
      delete x._id;
    });
    let resultsMatchData = JSON.stringify(matchResultsData, null, 2);
    let resultBuffer = Buffer.from(resultsMatchData);
    let resultsBackup = new AttachmentBuilder()
      .setName(
        turOf.tur_name.replace(/\s/gm, "_") +
          "_Total_Match_" +
          turOf.result_matchs.length +
          ".txt"
      )
      .setFile(resultBuffer);
    turOf.result_matchs = [];
    await turOf.save();
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            "**Match Reseted Successfully **<a:tur_done:1015661729109254164> "
          )
          .setColor(0x45fd1b)
          .setDescription("**Results Reseted**")
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });

    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Reseted Results Match")
          .setColor(0x999999)
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp()
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
      files: [resultsBackup],
    });
  },
};
