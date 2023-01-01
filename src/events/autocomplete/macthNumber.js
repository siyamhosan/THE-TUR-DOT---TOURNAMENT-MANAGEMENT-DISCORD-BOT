const { Client, BaseInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {Client} client
   * @param {BaseInteraction} interaction
   *
   */
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (
      interaction.commandName === "result" &&
      (interaction.options.getSubcommand() === "delete" ||
        interaction.options.getSubcommand() === "getbenner" ||
        interaction.options.getSubcommand() === "update")
    ) {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });
      if (!turOf) return;
      let matchs = turOf.result_matchs.map((x, idx) => ({
        name: idx + 1 + " - " + x.map,
        value: idx.toString(),
      }));

      console.log(matchs);
      await interaction.respond(matchs);
    }
  },
};
