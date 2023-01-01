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
      interaction.commandName === "request" &&
      interaction.guildId === "1012948815894040687"
    ) {
      const storeOfDB = require("../../schema/storeofSMAS");
      let storeOf = await storeOfDB.findOne({
        guildID: "1012948815894040687",
      });
      console.log(storeOf);
      if (!storeOf) return;
      let matchs = Object.values(storeOf.communityRequs)
        .flat()
        .map((x) => x.commId);

      await interaction.respond(
        matchs.map((choice) => ({ name: choice, value: choice }))
      );
    }
  },
};
