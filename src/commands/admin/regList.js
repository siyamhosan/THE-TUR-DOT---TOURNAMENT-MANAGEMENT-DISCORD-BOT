const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
  Message,
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
  name: "reglist",
  aliases: ["registrationlist"],
  category: "Registration",
  description: "Shows all registered teams name",
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

    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member.roles.includes(turOf.tur_mod)
    ) {
    } else {
      return message.reply({
        embeds: [notAdminMessage],
      });
    }

    if (!turOf) {
      message.reply({
        embeds: [wrongChannel],
      });
    }
    if (turOf.reg_list.length <= 0) {
      return message.reply({
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

    let names = turOf.reg_list.map((x, idx) => {
      let nameWithNum = `${idx + 1}. ${x.name}`;
      return nameWithNum;
    });
    let editReplyMessage = new EmbedBuilder()
      .setTitle("<a:tur_ra:1024316087938076712> Registered List")
      .setDescription("List From: " + turOf.tur_name)
      .setColor(client.embedColor)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    editReplyMessage.addFields({
      name: "<a:animated_arrow:1024306395740385351> Names:",
      value: `${names.join("\n")}`,
    });
    message.reply({ embeds: [editReplyMessage] });
    return;
  },
};
