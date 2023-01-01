const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("community")
    .setDescription("connection between hub to roots")
    .addSubcommand((command) =>
      command
        .setName("create")
        .setDescription("Creates a new Community Hub")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name Of Community")
            .setRequired(true)
            .setMinLength(3)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Set description of the Community")
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("logo")
            .setDescription("Logo of the community")
            .setRequired(true)
        )
    ),
};
