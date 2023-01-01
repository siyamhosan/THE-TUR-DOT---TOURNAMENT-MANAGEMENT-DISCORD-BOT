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
  subCommand: "result.delete",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();
    let messageData;
    let matchNumber = interaction.options.get("number").value;

    const turOfDB = require("../../schema/turnamentSMAS");
    const storeOfDB = require("../../schema/storeofSMAS");
    let turOf = await turOfDB
      .findOne({ tur_pretent: interaction.channel.parentId })
      .catch(console.error);
    let storeOf = await storeOfDB.findOne({ guildID: interaction.guildId });
    //Prosses Started Message

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    if (!turOf) {
      return interaction.editReply({
        embeds: [wrongChannel],
      });
    }
    //get and delete

    if (turOf.result_matchs.length < matchNumber) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Match's Found")
            .setDescription("Please Add match's before asking results")
            .setColor(0x4281ff)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }

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

    let matchs = turOf.result_matchs;
    matchs.slice(matchNumber - 1, 1);
    turOf.result_matchs = matchs;

    await turOf.save();
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            "**Match Info Edited successfully **<a:tur_done:1015661729109254164> "
          )
          .setColor(0x45fd1b)
          .setDescription(matchNumber + " **No. Match info Deleted**")
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });

    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Match Info Edited")
          .setColor(0x999999)
          .setDescription(matchNumber + " **No. Match info Deleted**")
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      files: [resultsBackup],
    });
  },
};
