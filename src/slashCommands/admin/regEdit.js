const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { notAdminMessage } = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "admin.update",

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

    let teamNameObid = turOf.reg_list.findIndex(
      (x) => x.name === interaction.options.getString("name").toUpperCase()
    );
    if (teamNameObid === -1) {
      return interaction.editReply({
        ephemeral: true,
        content: "No Team Found",
      });
    }

    switch (interaction.options.getString("intention")) {
      case "name":
        if (!interaction.options.getString("quary"))
          return interaction.editReply({
            content:
              "Must Include quary . quary is that option where you put new name",
            ephemeral: true,
          });
        if (
          turOf.reg_list
            .map((x) => x.name)
            .includes(interaction.options.getString("quary").toUpperCase())
        )
          return interaction.editReply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setTitle("Error! <a:tur_error:1032255870567993364>")
                .setDescription(
                  "Sorry! This Name Already Exist. Duplicate Name"
                )
                .setColor(0xcc0000)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
          });

        let successEmbed = new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Edited.")
          .addFields({
            name: "Team Information",
            value: `<a:animated_arrow:1024306395740385351>**NEW TEAM NAME:${interaction.options
              .getString("quary")
              .toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **OLD TEAM NAME: ${
              turOf.reg_list[teamNameObid].name
            }**\n<a:animated_arrow:1024306395740385351> **MEMBERS LIST: ${
              turOf.reg_list[teamNameObid].list
            }**`,
          })
          .setColor(0x17fa83)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
        turOf.reg_list[teamNameObid].name = interaction.options
          .getString("quary")
          .toUpperCase();
        if (turOf.reg_list[teamNameObid].logo)
          successEmbed.setImage(turOf.reg_list[teamNameObid].logo);
        interaction.editReply({
          embeds: [successEmbed],
        });
        break;
      case "list":
        if (!interaction.options.getString("quary"))
          return interaction.editReply({
            content:
              "Must Include quary . quary is that option where you put new name",
            ephemeral: true,
          });

        let successEmbed2 = new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Edited.")
          .addFields({
            name: "Team Information",
            value: `<a:animated_arrow:1024306395740385351> **TEAM NAME: ${
              turOf.reg_list[teamNameObid].name
            }**\n<a:animated_arrow:1024306395740385351> **OLD MEMBERS LIST: ${
              turOf.reg_list[teamNameObid].list
            }**\n<a:animated_arrow:1024306395740385351> **NEW  MEMBERS LIST: ${interaction.options.getString(
              "quary"
            )}**`,
          })
          .setColor(0x17fa83)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
        turOf.reg_list[teamNameObid].list =
          interaction.options.getString("quary");
        if (turOf.reg_list[teamNameObid].logo)
          successEmbed2.setImage(turOf.reg_list[teamNameObid].logo);
        interaction.editReply({
          embeds: [successEmbed2],
        });
        break;
      case "logo":
        if (!interaction.options.getAttachment("quary-logo"))
          return interaction.editReply({
            content:
              "Must Include quary-logo . quary is that option where you put new name",
            ephemeral: true,
          });
        let successEmbed3 = new EmbedBuilder()
          .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
          .setDescription("Successfully Edited.")
          .addFields({
            name: "Team Information",
            value: `<a:animated_arrow:1024306395740385351> **TEAM NAME: ${turOf.reg_list[teamNameObid].name}**\n<a:animated_arrow:1024306395740385351> **MEMBERS LIST: ${turOf.reg_list[teamNameObid].list}**`,
          })
          .setColor(0x17fa83)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp();
        turOf.reg_list[teamNameObid].logo =
          interaction.options.getAttachment("quary-logo").proxyURL;
        if (turOf.reg_list[teamNameObid].logo)
          successEmbed3.setImage(turOf.reg_list[teamNameObid].logo);
        interaction.editReply({
          embeds: [successEmbed3],
        });
        break;
    }

    await turOf.save();
  },
};
