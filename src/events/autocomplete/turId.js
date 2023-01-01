const { Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {Client} client
   */
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;

    if (interaction.commandName === "tour") {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.find({ guildID: interaction.guildId });
      let turIds = turOf.map((x) => ({
        id: x.tur_id,
        name: x.tur_name,
      }));
      await interaction.respond(
        turIds.map((choice) => ({ name: choice.name, value: choice.id }))
      );
    }
  },
};
