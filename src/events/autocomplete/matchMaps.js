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
      interaction.options.getSubcommand() === "add"
    ) {
      let maps = [
        "Bermuda",
        "Purgatory",
        "Kalahari",
        "NeXTerra",
        "Alpine",
        "Bermuda Remastered",
        "Erangel",
        "Miramar",
        "Sanhok",
        "Vikendi",
        "Horizon Valley",
        "Valley Skirmish",
        "Hook Wars",
        "Black City Arena",
        "Deathmatch",
        "Football Fever (3v3)",
        "Party Crasher",
        "Phase Runner",
        "Overflow",
        "Encore",
        "Habitat 4",
        "Drop-Off",
        "Storm Point",
        "Olympus",
        "World's Edge",
        "Kings Canyon",
      ];

      const focusedValue = interaction.options.getFocused();
      const filtered = [];
      maps.filter((choice, idx) => {
        if (!choice.startsWith(focusedValue.toUpperCase()) || idx >= 23) return;
        return filtered.push(choice.toString());
      });
      if (filtered.length < 1) return;
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  },
};
