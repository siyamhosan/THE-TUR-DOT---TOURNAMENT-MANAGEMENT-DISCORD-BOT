const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Get Payment Information")
    .addSubcommand((command) =>
      command
        .setName("add")
        .setDescription("Add a payment method")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name Of the Payment option")
            .setRequired(true)
            .setMinLength(3)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Id/number Of the payment method")
            .setRequired(true)
            .setMinLength(5)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("Set a emoji of this payment method")
        )
    )
    .addSubcommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a payment method")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("id Of the pay method")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("reset").setDescription("Reset all payment method")
    )
    .addSubcommand((command) =>
      command.setName("info").setDescription("Get Payment Methods")
    ),
};
