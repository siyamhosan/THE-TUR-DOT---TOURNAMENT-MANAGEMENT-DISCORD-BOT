const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
module.exports = {
  subCommand: "pay.remove",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    interaction.deferReply();

    const turOf = await turOfDB.findOne({ tur_manage: interaction.channelId });
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
            .setTitle("No Payment Method")
            .setDescription("You dont have any payment method with this id")
            .setTimestamp()
            .setColor(0xcc0000),
        ],
      });
    } else {
      let indexOfterget = payOf.findIndex(
        (x) => x.info === interaction.options.get("id").value
      );

      payOf.splice(indexOfterget, 1);

      turOf.pay_info = payOf;
      await turOf.save();
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Removed Payment Method")
            .setDescription(
              "You dont have any Payment Method on with this id from now"
            )
            .setTimestamp()
            .setColor(0x00ff36),
        ],
      });
    }
  },
};
