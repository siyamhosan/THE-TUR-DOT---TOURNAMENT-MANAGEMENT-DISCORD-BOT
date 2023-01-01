const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");

module.exports = {
  name: "regreset",
  aliases: ["registrationreset"],
  category: "Registration",
  description: "Reset all registries of this tournament",
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
      tur_pretent: interaction.channel.parentId,
    });
    let notAdminMessage = new EmbedBuilder()
      .setTitle("You Dont Have `ADMINISTRATOR` Permission")
      .setColor(0xcc0000)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({ name: "User:", value: `${interaction.user.tag}` })
      .setTimestamp();
    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return message.reply({
        embeds: [notAdminMessage],
      });
    }

    if (!turOf) {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Wrong Channel")
            .setDescription(
              "This Command Suppose to be used in a tur manage channel. please consider"
            )
            .setColor(0xcc0000)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    if (turOf.reg_list.length <= 0) {
      return message.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("Error!")
            .setDescription(`There is nothing to reset`)
            .setColor(0x913a00)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
    const XLSX = require("xlsx");
    let regList = turOf.reg_list;
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

    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Registration Reseted!")
          .setColor(client.wrongColor)
          .setDescription(
            `old List Data:\nTotal Reg Was: ${turOf.reg_list.length}`
          ),
      ],
      files: [csvRow],
    });
    turOf.reg_list = [];
    turOf.save();
    message.reply({
      embeds: [
        new EmbedBuilder()

          .setTitle("Success! <a:tur_done:1015661729109254164>")
          .setDescription("Successfully reseted registration.")
          .setColor(client.successColor)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
