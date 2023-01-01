const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "pay.add",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    let turOf = await turOfDB.findOne({
      tur_manage: interaction.channelId,
    });
    if (!turOf) {
      return interaction.editReply({
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
    let payOf = turOf.pay_info;
    let iGD = interaction.options;
    let emoji;
    if (iGD.get("emoji")) {
      emoji = iGD.get("emoji").value;
    } else {
      emoji = "";
    }
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Payment added")
          .setDescription("Payment Added And sticked in registration")
          .addFields({
            name: "Name and id",
            value: `${emoji}${interaction.options
              .get("name")
              .value.toUpperCase()}: ${interaction.options.get("id").value}`,
          })
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
    let newData = [
      {
        title: iGD.get("name").value.toUpperCase(),
        info: iGD.get("id").value,
        emoji: emoji,
        payString: `${emoji}${interaction.options
          .get("name")
          .value.toUpperCase()}: ${interaction.options.get("id").value}`,
      },
    ];
    turOf.pay_info = payOf.concat(newData);
    turOf.save();
  },
};
