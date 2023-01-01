const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("result")
    .setDescription("Results for tounaments")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add Match Result String To Results")
        .addStringOption((option) =>
          option
            .setName("string")
            .setDescription(
              "Match Info example: `<team-name> <kill>, Demo: team 8, team-2 9, team-3 5, team-4 8`"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("map")
            .setDescription("Match map")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("update")
        .setDescription("Replace a Match result String")
        .addNumberOption((option) =>
          option
            .setName("number")
            .setDescription("Number of the match")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("string")
            .setDescription(
              "Match Info example: `<team-name> <kill>, Demo: team 8, team-2 9, team-3 5, team-4 8`"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("delete")
        .setDescription("Replace a Match result String")
        .addNumberOption((option) =>
          option
            .setName("number")
            .setDescription("Number of the match")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("reset").setDescription("Replace a Match result String")
    )
    .addSubcommand((command) =>
      command
        .setName("info")
        .setDescription("Get result Info of any squad")
        .addStringOption((option) =>
          option
            .setName("squad")
            .setDescription("Get Info about specific Squad")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("getbenner")
        .setDescription("Get a result")
        .addNumberOption((option) =>
          option
            .setName("match")
            .setDescription("get a specific match result")
            .setRequired(false)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("benner-customize")
        .setDescription("Customize your result benner")
        .addAttachmentOption((option) =>
          option
            .setName("background")
            .setDescription(
              "Custom background (Size required 1280x720). You are always welcome to try variants of sizes"
            )
        )
        .addStringOption((option) =>
          option.setName("hadder-text").setDescription("Hadding Title Text")
        )
        .addStringOption((option) =>
          option
            .setName("hadder-color")
            .setDescription("Hadding Title color (Hex Code). example: #15ca83")
        )
        .addStringOption((option) =>
          option.setName("dis-text").setDescription("Description Text")
        )
        .addStringOption((option) =>
          option
            .setName("dis-color")
            .setDescription("Description color (Hex Code). example: #15ca83")
        )
        .addStringOption((option) =>
          option
            .setName("result-color")
            .setDescription(
              "Color of The Top Table row (Hex Code). example: #15ca83"
            )
        )
    ),
};
