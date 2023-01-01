const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const { replaceR } = require("../../helpers/welcommerTags");

module.exports = {
  subCommand: "setup.welcome",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    const storeOfDB = require("../../schema/storeofSMAS");
    let storeOf = await storeOfDB.findOne({ guildID: interaction.guildId });
    const { options } = interaction;
    let data = {
      channel: options.getChannel("channel").id,
      content: options.getString("message-title"),
      embed_title: null,
      embed_des: null,
      bgURL: options.getAttachment("background").proxyURL,
      avatar_border_color: null,
      welcome_color: null,
      username_color: null,
      message__text: options.getString("benner-message"),
      message__color: null,
    };
    let checker = /^#([0-9a-f]{3}){1,2}$/i;
    let successEmbedLL = new EmbedBuilder()
      .setTitle("Error! <:tur_error:1027176125518073876> ")
      .setDescription(
        "Please check the hex color code on hadder-color. To get hex color you can use [hex color](https://www.color-hex.com/)"
      )
      .setColor(0x913a00)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    if (options.getString("embed-title"))
      data.embed_title = options.getString("embed-title");
    if (options.getString("embed-description"))
      data.embed_des = options.getString("embed-description");

    if (options.getString("avatar-border")) {
      if (!checker.test(options.get("avatar-border").value))
        return interaction.editReply({
          embeds: [successEmbedLL],
        });
      data.avatar_border_color = options.getString("avatar-border");
    }
    if (options.getString("welcome-text-color")) {
      if (!checker.test(options.get("welcome-text-color").value))
        return interaction.editReply({
          embeds: [successEmbedLL],
        });
      data.welcome_color = options.getString("welcome-text-color");
    }
    if (options.getString("username-color")) {
      if (!checker.test(options.get("username-color").value))
        return interaction.editReply({
          embeds: [successEmbedLL],
        });
      data.username_color = options.getString("username-color");
    }
    if (options.getString("benner-message-color")) {
      if (!checker.test(options.get("benner-message-color").value))
        return interaction.editReply({
          embeds: [successEmbedLL],
        });
      data.message__color = options.getString("benner-message-color");
    }

    storeOf.welcomer = data;
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Welcomer Deployed")
          .setDescription(
            `Welcomer Deployed In ${options.getChannel("channel")}`
          )
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
    storeOf.save();
    {
    if (!storeOf.welcomer) return;
    if (!storeOf.welcomer.channel) return;
  

    let wlcData = replaceR(storeOf.welcomer, interaction.member);
    

    const { wlcBenner } = require("../../helpers/tamplates/welcomeTemp1");
    let canvasToBuffer = await (
      await wlcBenner(wlcData, member, "WELCOME")
    ).toBuffer();
    let bennerAttach = new AttachmentBuilder()
      .setFile(canvasToBuffer)
      .setName(interaction.member.user.username + ".png");
    if (wlcData.embed_title || wlcData.embed_des) {
      let embed = new EmbedBuilder().setColor(0x00fab9).setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });
      if (wlcData.embed_title) embed.setTitle(wlcData.embed_title);
      if (wlcData.embed_des) embed.setDescription(wlcData.embed_des);

      interaction.channel.send({
        embeds: [embed],
        files: [bennerAttach],
        content: wlcData.content,
      });
      return;
    }
    interaction.channel.send({
      files: [bennerAttach],
      content: wlcData.content,
    });
  }
  },
};
