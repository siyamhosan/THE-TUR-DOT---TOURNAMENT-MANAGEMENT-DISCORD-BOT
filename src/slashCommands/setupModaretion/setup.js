const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup Command")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((option) =>
      option
        .setName("welcome")
        .setDescription("Setup Welcome")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Select The channel you want to get welcome messages"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message-title")
            .setDescription("Enter Your Message Content")
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("background")
            .setRequired(true)
            .setDescription("Your Welcome Benner background")
        )
        .addStringOption((option) =>
          option
            .setName("benner-message")
            .setRequired(true)
            .setDescription("Your Welcome Benner Message Text")
        )
        .addStringOption((option) =>
          option
            .setName("welcome-text-color")
            .setRequired(false)
            .setDescription("Your Welcome Benner Welcome Text Color")
        )
        .addStringOption((option) =>
          option
            .setName("embed-title")
            .setDescription("Enter Your Message Embed Title  ")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("embed-description")
            .setDescription("Enter Your Message Embed Description. ")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("avatar-border")
            .setRequired(false)
            .setDescription("Your Welcome Benner Avatar Border Color")
        )
        .addStringOption((option) =>
          option
            .setName("username-color")
            .setRequired(false)
            .setDescription("Your Welcome Benner Username text Color")
        )
        .addStringOption((option) =>
          option
            .setName("benner-message-color")
            .setRequired(false)
            .setDescription("Your Welcome Message Color")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("goodbay")
        .setDescription("Setup goodbay")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Select The channel you want to get goodbay messages"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message-title")
            .setDescription("Enter Your Message Content")
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("background")
            .setRequired(true)
            .setDescription("Your goodbay Benner background")
        )
        .addStringOption((option) =>
          option
            .setName("benner-message")
            .setRequired(true)
            .setDescription("Your goodbay Benner Message Text")
        )
        .addStringOption((option) =>
          option
            .setName("goodbay-text-color")
            .setRequired(false)
            .setDescription("Your goodbay Benner goodbay Text Color")
        )
        .addStringOption((option) =>
          option
            .setName("embed-title")
            .setDescription("Enter Your Message Embed Title  ")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("embed-description")
            .setDescription("Enter Your Message Embed Description. ")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("avatar-border")
            .setRequired(false)
            .setDescription("Your goodbay Benner Avatar Border Color")
        )
        .addStringOption((option) =>
          option
            .setName("username-color")
            .setRequired(false)
            .setDescription("Your goodbay Benner Username text Color")
        )
        .addStringOption((option) =>
          option
            .setName("benner-message-color")
            .setRequired(false)
            .setDescription("Your goodbay Message Color")
        )
    ),
};
