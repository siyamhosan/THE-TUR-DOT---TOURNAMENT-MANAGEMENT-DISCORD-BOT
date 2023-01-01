const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "about",
  category: "Information",
  aliases: ["botinfo", "info"],
  description: "See information about this project.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  execute: async (message, args, client, prefix) => {
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
          value: `[The IUR DOT](https://thetur.xyz/) was created by **Siyam Hosan Jr.#3343**. Advanced tournament management discord bot with multiple registrations and automatic results. With it you can make good looking results benner in just a few clicks. It supports benner customizations and auto-assigning roles to groups of teams. For Music it uses lavamusic!`,
          inline: true,
        },
      ]);
    return message.reply({ embeds: [mainPage], components: [row] });
  },
};
