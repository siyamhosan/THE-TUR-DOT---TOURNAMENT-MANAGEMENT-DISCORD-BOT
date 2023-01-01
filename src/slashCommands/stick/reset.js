const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
module.exports = {
  subCommand: "stick.reset",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    try {
      const turOf = await turOfDB
        .findOne({ tur_manage: interaction.channelId })
        .catch((e) => console.log(e));
      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        interaction.member.roles.cache.has(turOf.tur_mod)
      ) {
      } else
        return interaction.editReply({
          content:
            "Only Admin Or Tur Manager Can Use This <:tur_role:1023984013548998719>",
          ephemeral: true,
        });
      if (!turOf) {
        return interaction.editReply({
          content:
            "Please run this command in tournament manage channel.<a:tur_redCheck:1017059852222218291>\nThis is only for tournaments",
        });
      }
      const stickOFDB = require("../../schema/stickyMessageSMAS");
      let stickyOfG = await stickOFDB.find({
        guildId: interaction.guildId,
      });
      if (stickyOfG.length === 0) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("No Sticky Message")
              .setDescription(
                "You dont have any sticky message on this channel"
              )
              .setTimestamp()
              .setColor(0xcc0000),
          ],
        });
      } else {
        await stickyOfG.forEach((x) => x.delete());
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Removed All Sticky Message")
              .setDescription(
                "You dont have any sticky message on this server from now"
              )
              .setTimestamp()
              .setColor(0x00ff36),
          ],
        });
      }
    } catch (e) {
      console.log(e);
      interaction.editReply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("Error! <:tur_error:1027176125518073876> ")
            .setDescription(`${e}`)
            .setColor(0x913a00)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
      const { config } = require("dotenv");
      config();
      client.guilds.cache
        .get(process.env.TUR_GUILD_ID)
        .channels.cache.get(process.env.TUR_ERROR_LOG)
        .send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error! <:tur_error:1027176125518073876> ")
              .setDescription(`${e}`)
              .setColor(0x913a00)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
    }
  },
};
