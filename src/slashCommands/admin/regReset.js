const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  subCommand: "admin.reset",

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
      let notAdminMessage = new EmbedBuilder()
        .setTitle("You Dont Have `ADMINISTRATOR` Permission")
        .setColor(0xcc0000)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .addFields({ name: "User:", value: `${interaction.user.tag}` })
        .setTimestamp();
      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        interaction.member.roles.cache.has(turOf.tur_mod)
      ) {
      } else {
        return interaction.editReply({
          embeds: [notAdminMessage],
        });
      }

      if (!turOf) {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Wrong Channel")
              .setDescription(
                "This Command Suppose to be used in a tur manage channel. please consider"
              )
              .setColor(0xcc0000)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        });
      }
      if (turOf.reg_list.length <= 0) {
        return interaction.editReply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setTitle("Error!")
              .setDescription(`There is nothing to reset`)
              .setColor(0x913a00)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      }
      client.channels.cache.get(turOf.tur_log).send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Registration Reset!")
            .setDescription(
              `old List: ${turOf.reg_list.map((x) => x.name).join("\n")}`
            ),
        ],
      });
      turOf.reg_list = [];
      turOf.save();
      interaction.editReply({
        embeds: [
          new EmbedBuilder()

            .setTitle("Success! <a:tur_done:1015661729109254164>")
            .setDescription("Successfully reseted registration.")
            .setColor(0xff6600)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
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
              .addFields({
                name: "At :",
                value: `${interaction.guild.name}(${interaction.guildId})`,
              })
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
