const { Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {Client} client
   */
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === "pay") {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.find({ guildID: interaction.guildId });
      let payInfo = turOf.map((x) => x.pay_info);
      let turIds = payInfo.map((x) => x.map((y) => y.info));
      await interaction.respond(
        turIds[0].map((choice) => ({ name: choice, value: choice }))
      );
    }
  },
};
