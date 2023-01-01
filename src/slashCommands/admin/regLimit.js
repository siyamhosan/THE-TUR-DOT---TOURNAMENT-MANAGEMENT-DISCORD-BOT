const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "admin.limit",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    try {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });

      if (!turOf) {
        interaction.editReply({
          embeds: [wrongChannel],
        });
      }
      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        interaction.member.roles.cache.has(turOf.tur_mod)
      ) {
      } else {
        return interaction.editReply({
          embeds: [notAdminMessage],
        });
      }
      turOf.reg_limit = interaction.options.get("slots").value;
      turOf.save();
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
            .setDescription(
              "Registration slot is now: " +
                interaction.options.get("slots").value
            )
            .setColor(0xff6600)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    } catch (e) {
      console.log(e);
      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Error!")
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
