const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
  SlashCommandBuilder,
} = require("discord.js");
const stickyDB = require("../../schema/stickyMessageSMAS");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("Sticky message management.")
    .addSubcommand((command) =>
      command
        .setName("create")
        .setDescription("Create a sticky message.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to attach the sticky message to.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("threshold")
            .setDescription(
              "Enter the threshold for when the sticky message should be resent."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("text")
            .setDescription("Enter the text for the sticky message.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription(
              'Enter a optional title for the sticky message to replace "Sticky Message".'
            )
            .setRequired(false)
        )
        .addAttachmentOption((option) =>
          option
            .setName("image")
            .setDescription("Enter a optional image for the sticky message.")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("delete")
        .setDescription("Delete a sticky message.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to delete the sticky message from.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("list").setDescription("List all sticky messages.")
    ),
};
