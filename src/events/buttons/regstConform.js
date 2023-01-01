const {
  Client,
  EmbedBuilder,
  ButtonInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const { notAdminMessage } = require("../../helpers/embedMessages");

module.exports = {
  name: "interactionCreate",
  /**
   * @param{ButtonInteraction} interaction
   * @param{Client} client
   *
   */
  run: async (client, interaction) => {
    if (!interaction.isButton) return;
    const storeOfDB = require("../../schema/storeofSMAS");
    const turOfDB = require("../../schema/turnamentSMAS");

    let jsonData = await storeOfDB.findOne({
      guildID: interaction.guildId,
    });
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    if (!turOf) return;
    let logCHannel = turOf.tur_log;

    if (interaction.customId === "regStconfoirm") {
      let SuccessfulStart = new EmbedBuilder()
        .setTitle(
          "<a:tur_right_arrow:1016656565375340584> Successfully Started Registration And Deleted Old Name List <a:tur_done:1015661729109254164>"
        )
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(0x45fd1b)
        .setTimestamp();
      let logMessage = new EmbedBuilder()
        .setTitle("Successfully Started Registration")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(0x999999)
        .setTimestamp();

      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        interaction.member.roles.cache.has(jsonData.allowedAdminRoles)
      ) {
      } else {
        return interaction.channel.send({
          embeds: [notAdminMessage],
        });
      }
      turOf.reg_list = [];
      turOf.reg_status = "started";

      interaction.reply({
        embeds: [SuccessfulStart],
      });
      turOf.save();
      client.channels.cache.get(logCHannel).send({
        embeds: [logMessage],
      });
    } else if (interaction.customId === "regStdecline") {
      let SuccessfulStart = new EmbedBuilder()
        .setTitle("Successfully Started Registration Without Deleting Old list")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(0x45fd1b)
        .setTimestamp();
      let logMessage = new EmbedBuilder()
        .setTitle("Successfully Started Registration")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setColor(0x999999)
        .setTimestamp();

      if (
        interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
        interaction.member.roles.cache.has(jsonData.allowedAdminRoles)
      ) {
      } else {
        return interaction.channel.send({
          embeds: [notAdminMessage],
        });
      }
      turOf.reg_status = "started";
      interaction.reply({
        embeds: [SuccessfulStart],
      });
      turOf.save();
      client.channels.cache.get(logCHannel).send({
        embeds: [logMessage],
      });
    } else return;
  },
};
