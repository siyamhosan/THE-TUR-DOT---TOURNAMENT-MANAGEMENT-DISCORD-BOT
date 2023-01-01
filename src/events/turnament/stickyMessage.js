const {
  Message,
  Client,
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const stickyDB = require("../../schema/stickyMessageSMAS");

module.exports = {
  name: "messageCreate",
  /**
   * @param {Message} message
   * 
   */
  run: async (client, message) => {
    const { guild, channel, member } = message;
    if (message.author.bot) return;

    // Check if the message is sent in a channel defined as a sticky channel.
    const stickyData = await stickyDB.findOne({
      guildId: guild.id,
      channelID: channel.id,
    });
    if (!stickyData) return;

    // Deconstruct the sticky data from database.
    const {
      message: stickyMessage,
      threshold,
      messageCount,
      lastMessage,
      image,
      thumbnail,
      title,
    } = stickyData;

    // Check if the channel message count is greater than or equal to the threshold,
    // If true, reset messageCount to 0, and update the sticky message in the channel.
    if (messageCount >= threshold) {
      stickyData.messageCount = 0;
      stickyData.save();

      // Construct the embed with our data.
      const stickyEmbed = new EmbedBuilder()
        .setColor(0x25f4ff) // Change this to whatever color you want.
        .setTitle("<a:pin:1034828820454330379> Sticky Message") // Default title, this will only be applied if no title is provided.
        .setDescription(`${stickyMessage}`);
      if (title) stickyEmbed.setTitle(title); // If provided, set the embed title.
      if (image) stickyEmbed.setImage(image); // If provided, set the embed image.

      // Fetch the last sticky message sent in the channel and delete it.
      message.channel.messages
        .fetch(lastMessage)
        .then((fetchedMessage) => fetchedMessage.delete())
        .catch(() => null);

      // Send the new sticky message, and save the message ID to the database.
      //check if message on reg channel then add payment numbers
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: message.channel.parentId,
      });
      if (turOf) {
        let payOf = turOf.pay_info;
        if (!payOf) {
        } else {
          if (payOf.length >= 1 && message.channelId === turOf.reg_channel) {
            let payStrings = payOf.map((x) => x.payString);
            stickyEmbed.addFields({
              name: "Payment Methods",
              value: `${payStrings.join("\n")}`,
            });
          }
        }
        if (turOf.group_status && turOf.group_channel === message.channelId) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("getGroupRole")
              .setLabel("Get Group Role")
              .setEmoji("1034733773817909308")
              .setStyle(ButtonStyle.Success)
          );
          stickyEmbed.addFields({
            name: "Get group role by clicking this button or type",
            value: "```\nGroup: {group name}\nTeam Name: {Team Name}\n```",
          });
          message.channel
            .send({ embeds: [stickyEmbed], components: [row] })
            .then((msg) => {
              stickyData.lastMessage = msg.id;
              stickyData.save();
            });
          return;
        }
      }
      message.channel.send({ embeds: [stickyEmbed] }).then((msg) => {
        stickyData.lastMessage = msg.id;
        stickyData.save();
      });
    } else {
      // If the message count is less than the threshold, increment the message count.
      stickyData.messageCount += 1;
      stickyData.save();
      return;
    }
  },
};
