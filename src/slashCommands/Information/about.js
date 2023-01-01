const {
  EmbedBuilder,
  CommandInteraction,
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("See information about this project."),
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction) => {
    await interaction.deferReply({
      ephemeral: false,
    });

    const button = new ButtonBuilder()
      .setLabel("Invite")
      .setStyle(ButtonStyle.Link)
      .setURL(client.config.links.invite);

    const button3 = new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL(client.config.links.support);

    const row = new ActionRowBuilder().addComponents(button, button3);

    const mainPage = new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(0x303236)
      .addFields([
        {
          name: "Creator",
          value: "Siyam Hosan Jr.#3343",
          inline: true,
        },
        {
          name: "\u200b",
          value: `[THE TUR DOT](https://thetur.xyz/) was created by **Siyam Hosan Jr.#3343**. Advanced tournament management discord bot with multiple registrations and automatic results. With it you can make good looking results benner in just a few clicks. It supports benner customizations and auto-assigning roles to groups of teams. For Music it uses lavamusic!`,
          inline: true,
        },
      ]);
    await interaction.followUp({ embeds: [mainPage], components: [row] });
  },
};
