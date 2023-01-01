const {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  Colors,
  SlashCommandBuilder,
} = require("discord.js");
const stickyDB = require("../../schema/stickyMessageSMAS");
const mongoose = require("mongoose");
module.exports = {
  subCommand: "sticky.create",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} Client
   * @param
   */
  run: async (client, interaction) => {
    const { options, guild, member } = interaction;

    // Grab the interaction options.
    const channel = options.getChannel("channel");
    const threshold = options.getNumber("threshold") - 1; // Have to subtract 1, as code counts from 0.
    const text = options.getString("text");
    const title = options.getString("title") || "Sticky Message";
    let image = null;
    if (options.getAttachment("image"))
      image = options.getAttachment("image").proxyURL;

    // Create the sticky message in the database.
    await stickyDB.create({
      _id: mongoose.Types.ObjectId(),
      guildId: guild.id,
      channelID: channel.id,
      message: text,
      title: `<a:pin:1034828820454330379> ${title}`,
      image: image,
      createdBy: member.id,
      threshold: threshold,
      messageCount: 0,
    });

    // Construct the embed.
    const stickyEmbed = new EmbedBuilder()
      .setTitle(`<a:pin:1034828820454330379> ${title}`)
      .setDescription(text)
      .setColor(Colors.Aqua) // Change this to whatever color you want.
      .setImage(image);

    // Send the sticky to the specified channel.
    const stickyMessage = await channel.send({ embeds: [stickyEmbed] });

    // Update the database with the message ID.
    await stickyDB.findOneAndUpdate(
      { guildId: guild.id, channelID: channel.id },
      { lastMessage: stickyMessage.id }
    );

    // Reply to the interaction.
    interaction.reply({
      content: `Successfully created a sticky message in ${channel.mention}!`,
      ephemeral: true,
    });
  },
};
