const {
  Client,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");
const mongoose = require("mongoose");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  name: "reglistsheet",
  aliases: ["registrationlistsheet", "regsheet"],
  category: "Registration",
  description: "Shows all registered teams in sheet file",
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

    message
      .reply({
        content: "Getting Data <a:tur_loading:1015661123602743448>",
      })
      .then(async (msg) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        msg.delete();
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

    message.reply({
      content: "Here You Go! <a:tur_blt:1034733773817909308>",
      files: [csvRow],
    });
  },
};
