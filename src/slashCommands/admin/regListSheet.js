const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const mongoose = require("mongoose");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "admin.list-sheet",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const turOfDB = require("../../schema/turnamentSMAS");

    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    if (!turOf) {
      return interaction.editReply({
        ephemeral: true,
        embeds: [wrongChannel],
      });
    }

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }

    interaction.editReply({
      content: "Getting Data <a:tur_loading:1015661123602743448>",
    });
    let regList = turOf.reg_list;
    regList.forEach((x) => {
      let user = client.users.cache.get(x.user);
      if (user) {
        x.user = user.tag;
      }
      delete x._id;
    });

    const XLSX = require("xlsx");

    function convertJsonToExcel() {
      const workSheet = XLSX.utils.json_to_sheet(regList);
      const workBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workBook, workSheet, "regList");
      // Generate buffer
      return XLSX.write(workBook, { bookType: "csv", type: "buffer" });
    }

    let csvRow = new AttachmentBuilder()
      .setName(
        turOf.tur_name.replace(/\s/gm, "_") +
          "_Total_Reg_" +
          regList.length +
          ".csv"
      )
      .setFile(convertJsonToExcel());

    interaction.editReply({
      content: "Here You Go! <a:tur_blt:1034733773817909308>",
      files: [csvRow],
    });
  },
};
