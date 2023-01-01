const { Client, ChannelType } = require("discord.js");
const stickyOfDB = require("../../schema/stickyMessageSMAS");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  name: "channelDelete",

  /**
   *
   * @param {Client} client
   */
  run: async (client, interction) => {
    await stickyOfDB.findOneAndDelete({
      guildId: interction.guildId,
      channelID: interction.id,
    });
    if (interction.type === ChannelType.GuildCategory) {
      if (
        await turOfDB.findOne({
          tur_pretent: interction.parentId,
          guildID: interction.guildId,
        })
      ) {
        await interction.children.cache((channel) => channel.delete());
        await turOfDB.findOneAndDelete({
          tur_pretent: interction.parentId,
          guildID: interction.guildId,
        });
      }
    }
  },
};
