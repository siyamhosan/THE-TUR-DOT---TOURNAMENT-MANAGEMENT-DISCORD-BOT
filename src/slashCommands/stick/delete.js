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
  subCommand: "sticky.delete",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} Client
   * @param
   */
  run: async (client, interaction) => {
    const { options, guild, member } = interaction;

    // Grab the interaction options.
    const channel = options.getChannel("channel");

    // Delete the sticky message from the database.
    await stickyDB.findOneAndDelete({
      guildId: guild.id,
      channelID: channel.id,
    });

    // Reply to the interaction.
    interaction.reply({
      content: `Successfully deleted the sticky message in ${channel.mention}!`,
      ephemeral: true,
    });
  },
};
