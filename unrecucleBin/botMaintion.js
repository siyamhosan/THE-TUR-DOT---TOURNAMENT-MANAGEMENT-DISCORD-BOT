const {
  Events,
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require("discord.js");
const {
  botMention,
  botMaintionHelp,
  botMentionInvite,
} = require("../../helpers/embedMessages");
const storeOfDB = require("../../schema/storeofSMAS");
module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  run: async (client, message) => {
    let storeOf = await storeOfDB.findOne({ guildID: message.guildId });
    let row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=990571985048317953&permissions=8&scope=bot%20applications.commands"
        )
        .setLabel("Invite Me"),
      new ButtonBuilder()
        .setURL("https://www.facebook.com/Sahoab.Hosan")
        .setLabel("Get help")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL("https://thetur.xyz/pages/commands.html")
        .setStyle(ButtonStyle.Link)
        .setLabel("Command List"),
    ]);

    let messageDataCC;
    if (message.content.includes("<@990571985048317953>"))
      messageDataCC = message.content
        .replace("<@990571985048317953>", " ")
        .trim();
    if (message.content === "<@990571985048317953>") {
      return message.reply({
        embeds: [botMention],
        components: [row],
      });
    }
    if (/help/gi.test(messageDataCC))
      return message.reply({ embeds: [botMaintionHelp], components: [row] });
    if (/invite/gi.test(messageDataCC))
      return message.reply({ embeds: [botMentionInvite], components: [row] });
    if (message.content.toLowerCase().startsWith("ig?help"))
      return message.reply({ embeds: [botMaintionHelp], components: [row] });
  },
};
