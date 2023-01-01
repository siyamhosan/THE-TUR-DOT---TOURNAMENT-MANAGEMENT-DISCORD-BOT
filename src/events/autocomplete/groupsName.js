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
      interaction.commandName === "admin" &&
      interaction.options.getSubcommand() === "delete"
    ) {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });
      if (!turOf) return;
      let matchs = Object.values(turOf.groups_list)
        .flat()
        .map((x) => x.group_name);

      await interaction.respond(
        matchs.map((choice) => ({ name: choice, value: choice }))
      );
    }
  },
};
