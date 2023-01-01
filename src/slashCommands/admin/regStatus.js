const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "admin.status",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    if (!turOf) {
      return interaction.editReply({
        ephemeral: true,
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

    turOf.reg_status = interaction.options.get("options").value;
    turOf.save();
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription(
            "Registration status is now: " +
              interaction.options.get("options").value
          )
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
    switch (interaction.options.getString("options")) {
      case "stReg":
        {
          await client.channels.cache.get(turOf.reg_channel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Registration Started!")
                .setDescription(
                  `Total Slots: ${turOf.reg_limit}\nSlots Available: ${
                    turOf.reg_limit - turOf.reg_list.length
                  }\n\nDo Register Your Team Fast <a:tur_blt:1034733773817909308>`
                )
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp()
                .setImage(turOf.tur_benner)
                .setColor(0x2ef297),
            ],
          });
        }
        break;
      case "ended":
        {
          await client.channels.cache.get(turOf.reg_channel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Registration Closed!")
                .setDescription(
                  `Total Slots: ${turOf.reg_limit}\nSlots Available: ${
                    turOf.reg_limit - turOf.reg_list.length
                  }\n\nDo Register Your Team Fast <a:tur_blt:1034733773817909308>`
                )
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setImage(turOf.tur_benner)
                .setTimestamp()
                .setColor(0xf55427),
            ],
          });
        }
        break;

      default:
        break;
    }
  },
};
