const {
  Message,
  Client,
  AttachmentBuilder,
  Events,
  EmbedBuilder,
} = require("discord.js");
const { replaceR } = require("../../helpers/welcommerTags");

module.exports = {
  name: Events.GuildMemberAdd,

  /**
   *
   * @param {Client} client
   */
  run: async (client, member) => {
    const storeOfDB = require("../../schema/storeofSMAS");
    let storeOf = await storeOfDB.findOne({ guildID: member.guild.id });
    if (!storeOf) return;
    if (!storeOf.welcomer) return;
    if (!storeOf.welcomer.channel) return;
    
    const {replaceR}=require("../../helpers/welcommerTags")

    let wlcData = replaceR(storeOf.welcomer, member);

    const { wlcBenner } = require("../../helpers/tamplates/welcomeTemp1");

    let canvasToBuffer = await (
      await wlcBenner(wlcData, member, "WELCOME")
    ).toBuffer();
    let bennerAttach = new AttachmentBuilder()
      .setFile(canvasToBuffer)
      .setName(member.user.username + ".png");
    if (wlcData.embed_title || wlcData.embed_title) {
      let embed = new EmbedBuilder().setColor(0x00fab9).setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });
      if (wlcData.embed_title) embed.setTitle(wlcData.embed_title);
      if (wlcData.embed_des) embed.setDescription(wlcData.embed_des);

      client.guilds.cache
        .get(member.guild.id)
        .channels.cache.get(wlcData.channel)
        .send({
          embeds: [embed],
          files: [bennerAttach],
          content: wlcData.content,
        });
      return;
    }
    client.guilds.cache
      .get(member.guild.id)
      .channels.cache.get(wlcData.channel)
      .send({
        files: [bennerAttach],
        content: wlcData.content,
      });
  },
};
