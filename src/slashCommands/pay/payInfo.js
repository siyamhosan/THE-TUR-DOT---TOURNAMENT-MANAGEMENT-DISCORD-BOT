const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  subCommand: "pay.info",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    let payList = turOf.pay_info.map((x) => x.payString);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Payment Methods")
          .setDescription(payList.join("\n")),
      ],
    });
  },
};
