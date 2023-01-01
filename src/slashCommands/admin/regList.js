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
const XLSX = require("xlsx");

function convertJsonToExcel(regList) {
  const workSheet = XLSX.utils.json_to_sheet(regList);
  const workBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workBook, workSheet, "regList");
  // Generate buffer
  return XLSX.write(workBook, { bookType: "csv", type: "buffer" });
}

module.exports = {
  subCommand: "admin.list",

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

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.includes(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }

    if (!turOf) {
      interaction.editReply({
        embeds: [wrongChannel],
      });
    }
    if (turOf.reg_list.length <= 0) {
      return interaction.editReply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("Error!")
            .setDescription(`There is no list to send`)
            .setColor(0x913a00)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
    let option;
    if (interaction.options.get("specific")) {
      option = interaction.options.get("specific").value;
    } else {
      option = "all";
    }
    let names = turOf.reg_list.map((x, idx) => {
      let nameWithNum = `${idx + 1}. ${x.name}`;
      return nameWithNum;
    });
    let editReplyMessage = new EmbedBuilder()
      .setTitle("<a:tur_ra:1024316087938076712> Registered List")
      .setDescription("List From: " + turOf.tur_name)
      .setColor(0xff6600)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    if (option === "name") {
      editReplyMessage.addFields({
        name: "<a:animated_arrow:1024306395740385351> Names:",
        value: `${names.join("\n")}`,
      });
      interaction.editReply({ embeds: [editReplyMessage] });
      return;
    } else if (option === "list") {
      let data = turOf.reg_list.map((x) => ({ name: x.name, list: x.list }));

      let csvRow = new AttachmentBuilder()
        .setName(
          turOf.tur_name.replace(/\s/gm, "_") +
            "_Total_Reg_" +
            turOf.reg_list.length +
            ".txt"
        )
        .setFile(Buffer.from(JSON.stringify(data, null, 2)));

      interaction.editReply({ embeds: [editReplyMessage], files: [csvRow] });
      return;
      // } else if (option === "logo") {
      //   let data = turOf.reg_list.map((x) => ({ name: x.name, list: x.list }));

      //   let csvRow = new AttachmentBuilder()
      //     .setName(
      //       turOf.tur_name.replace(/\s/gm, "_") +
      //         "_Total_Reg_" +
      //         turOf.reg_list.length +
      //         ".txt"
      //     )
      //     .setFile(Buffer.from(JSON.stringify(data, null, 2))).set

      //   interaction.editReply({ embeds: [editReplyMessage], files: [csvRow] })
      //   return;
    } else if (option === "all") {
      interaction
        .editReply({ content: "Getting List's", ephemeral: true })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          msg.delete();
        });
      turOf.reg_list.forEach(({ name, list, logo, time, user }, idx) => {
        let logoAttachment;
        if (logo === " " || logo === "" || !logo) {
        } else {
          logoAttachment = new AttachmentBuilder()
            .setFile(logo)
            .setName(name + ".png");
        }
        let allSquadEmbed = new EmbedBuilder()
          .setTitle("<a:tur_ra:1024316087938076712> Team Information")
          .setColor(0xff6600)
          .addFields({
            name: `**Slot: ${idx + 1}**\n**Team Name: ${name}**`,
            value: `**List:** \n <:line:1024317133997494342> ${list}\n<a:animated_arrow:1024306395740385351> **Registered by: **<@${user}>\n<a:animated_arrow:1024306395740385351>**Registered At:** ${time}`,
          })
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          });
        if (logoAttachment) {
          interaction.channel.send({
            embeds: [allSquadEmbed],
            files: [logoAttachment],
          });
        } else {
          interaction.channel.send({
            embeds: [allSquadEmbed],
          });
        }
      });
    }
  },
};
