const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  subCommand: "pay.reset",
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
    let payOf = turOf.pay_info;
    if (!payOf) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Payment Method's")
            .setDescription(
              "You dont have any payment method's in this tounament"
            )
            .setTimestamp()
            .setColor(0xcc0000),
        ],
      });
    } else {
      interaction.guild.channels.cache.get(turOf.tur_log).send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Removed ALL Payment Method's")
            .setDescription(
              `Old Payments:\n${turOf.pay_info
                .map((x) => x.payString)
                .join("\n")}`
            )
            .setTimestamp()
            .setColor(0x00ff36),
        ],
      });
      turOf.pay_info = [];
      await turOf.save().catch((e) => console.log(e));
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Removed ALL Payment Method's")
            .setDescription(
              "You dont have any Payment Method's on with this tur from now"
            )
            .setTimestamp()
            .setColor(0x00ff36),
        ],
      });
    }
  },
};
