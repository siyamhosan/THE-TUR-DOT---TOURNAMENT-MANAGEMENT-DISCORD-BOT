const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  subCommand: "community.create",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    let { guild } = interaction;
    let name = interaction.options.getString("name");
    let descriptions = interaction.options.getString("description");
    let logo = interaction.options.getAttachment("logo").proxyURL;

    let requestMsgId;
    let dateNow = performance.now();
    let tempIID = `COM${dateNow}`;
    let turID = tempIID.slice(0, 12).trim();

    const comOfDB = require("../../schema/communitySMAS");
    if (await comOfDB.findOne({ mainGuildID: interaction.guildId }))
      return interaction.editReply({
        content: "Already Have One Community.",
        ephemeral: true,
      });

    let requistEmbed = new EmbedBuilder({
      title: "Community creation submited!!",
      description: "The review process usually takes three business hours.",
    })
      .addFields({ name: "**Community Id**", value: `\`${turID}\`` })
      .setThumbnail(logo)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(0x2ef297)
      .setTimestamp();

    let requestDATA = {
      guildID: guild.id,
      guildname: guild.name,
      commName: name,
      commDes: descriptions,
      commLogo: logo,
      commId: turID,
      resustChannelId: interaction.channelId,
      requestMsgId: "",
    };

    const storeOfDb = require("../../schema/storeofSMAS");
    let storeOf = await storeOfDb.findOne({ guildID: "1012948815894040687" });
    interaction.reply({ embeds: [requistEmbed] }).then(async (msg) => {
      requestDATA.requestMsgId = msg.id.toString();
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    storeOf.communityRequs = storeOf.communityRequs.push(requestDATA);
    storeOf.save();

    await (await client.guilds.fetch("1012948815894040687")).channels.cache
      .get("1039445075287089214")
      .send({
        content: `command: </request:0>`,
        embeds: [
          new EmbedBuilder()
            .setTitle("Community Request!")
            .setDescription(
              `Community name: ${name}\nId: ${turID}\nCommunity Descriptions: ${descriptions}\nGuild Name: ${guild.name}\nGuild Members: ${guild.memberCount}`
            )
            .setColor(0xf96819)
            .setImage(logo),
        ],
      });
  },
};
