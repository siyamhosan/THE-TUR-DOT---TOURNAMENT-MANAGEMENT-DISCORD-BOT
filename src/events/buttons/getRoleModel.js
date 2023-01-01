const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Client,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isButton) return;

    if (interaction.customId === "getGroupRole") {
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId("getGroupRoleModel")
        .setTitle("Get Group Role!!");

      // Add components to modal

      // Create the text input components
      const groupName = new TextInputBuilder()
        .setCustomId("modalGroupName")
        // The label is the prompt the user sees for this input
        .setLabel("Enter The Group Name")
        .setRequired(true)

        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

      const teamName = new TextInputBuilder()
        .setCustomId("modalTeamName")
        .setRequired(true)
        .setLabel("Enter Your Team Name")
        .setStyle(TextInputStyle.Short);

      // An action row only holds one text input,
      // so you need one action row per text input.
      const firstActionRow = new ActionRowBuilder().addComponents(groupName);
      const secondActionRow = new ActionRowBuilder().addComponents(teamName);

      // Add inputs to the modal
      modal.addComponents(firstActionRow, secondActionRow);

      // Show the modal to the user
      await interaction.showModal(modal);
    }
  },
};
