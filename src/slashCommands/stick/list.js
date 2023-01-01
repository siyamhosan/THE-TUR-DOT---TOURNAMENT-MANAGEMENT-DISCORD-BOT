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
  subCommand: "sticky.list",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} Client
   * @param
   */
  run: async (client, interaction) => {
    const { options, guild, member } = interaction;

    // Define array to store the sticky messages.
    let = stickyList = [];

    // Grab the sticky messages from the database.
    const stickyMessages = await stickyDB.find({ guildId: guild.id });
    if (!stickyMessages)
      return interaction.reply({
        content: "There are no sticky messages in this server!",
        ephemeral: true,
      });

    // Construct the embed.
    const stickyEmbed = new EmbedBuilder()
      .setTitle(`<a:pin:1034828820454330379> Sticky Messages`)
      .setColor(Colors.Yellow); // Change this to whatever color you want.

    // Loop through the sticky messages.
    for (const stickyMessage of stickyMessages) {
      // Get channel name.
      const channel = guild.channels.cache.get(stickyMessage.channelID);

      // Get member name.
      const member = guild.members.cache.get(stickyMessage.createdBy);

      // Add to array.
      stickyList.push({
        name: `[#${channel.name}](${channel.url}), ${member.user.username}`,
        value: `${stickyMessage.message}`,
      });
    }
    // Add the fields to the embed.
    stickyEmbed.addFields(stickyList);

    // Reply to the interaction.
    interaction.reply({
      embeds: [stickyEmbed],
      ephemeral: true,
    });
  },
};
