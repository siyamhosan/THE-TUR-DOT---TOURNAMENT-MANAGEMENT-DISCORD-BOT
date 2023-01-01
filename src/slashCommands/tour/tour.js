const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tour")
    .setDescription("Tournament manage command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((command) =>
      command
        .setName("create")

        .setDescription("Creates a new tournament")
        .addStringOption((option) =>
          option
            .setName("tour-name")
            .setDescription("Name Of Tournament")
            .setRequired(true)
            .setMinLength(3)
        )
        .addBooleanOption((option) =>
          option
            .setName("payment")
            .setDescription("Is Your tour Require Payment ?")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("mode-role")
            .setDescription(
              "Moderator Role To manage Tournament(default only server admin)"
            )
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("tour-benner")
            .setDescription("Benner For Tournament (Can not set letter)")
            .setRequired(false)
        )

        .addNumberOption((option) =>
          option
            .setName("slots")
            .setDescription(
              "Slot For Team's To Register(Can be change letter. Default:12)"
            )
            .setMaxValue(500)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("temp")
        .setDescription(
          "Creates a temporary tournament (Auto Delete After 3 Hours)"
        )
    )
    .addSubcommand((command) =>
      command
        .setName("delete")
        .setDescription("Delete a tournament")
        .addStringOption((option) =>
          option
            .setName("tour-id")
            .setDescription("Id Of The Tournament")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
};
