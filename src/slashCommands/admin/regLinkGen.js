const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const mongoose = require("mongoose");
const { wrongChannel } = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "admin.link-generator",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const shortofDB = require("../../schema/linkShortner");
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
    const shortOf = await shortofDB.findOne({ tur_id: turOf.tur_id });
    if (shortOf)
      return interaction.editReply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("Success! <a:tur_done:1015661729109254164>")
            .setDescription(
              `**There is Your Reg Link: **${
                process.env.DOMAIN + shortOf.short
              }\n**Tour Name**: ${turOf.tur_name}\n**Reg Status**: ${
                turOf.reg_status
              }\n**Reg Slots Avaiable**: ${
                turOf.reg_limit - turOf.reg_list.length
              }`
            )
            .setColor(0xcc0000)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    const shortId = require("shortid");
    let date = new Date();
    let dateNow =
      date.toLocaleDateString("en-US", { day: "numeric" }) +
      "/" +
      date.toLocaleDateString("en-US", { month: "numeric" }) +
      "/" +
      date.toLocaleDateString("en-US", { year: "numeric" });
    let dateExprire =
      date.toLocaleDateString("en-US", { day: "numeric" }) +
      "/" +
      (parseInt(date.toLocaleDateString("en-US", { month: "numeric" })) + 1) +
      "/" +
      date.toLocaleDateString("en-US", { year: "numeric" });
    let shortID = shortId.generate();
    await shortofDB.create({
      _id: mongoose.Types.ObjectId(),
      tur_id: turOf.tur_id,
      full: `${process.env.DOMAIN}t/${turOf.tur_id}/registration`,
      short: shortID,
      createdAt: dateNow,
      exprie: dateExprire,
      click: 0,
    });
    interaction.editReply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setTitle("Success! <a:tur_done:1015661729109254164>")
          .setDescription(
            `**There is Your Reg Link: **${
              process.env.DOMAIN + shortID
            }\n**Tour Name**: ${turOf.tur_name}\n**Reg Status**: ${
              turOf.reg_status
            }\n**Reg Slots Avaiable**: ${
              turOf.reg_limit - turOf.reg_list.length
            }`
          )
          .setColor(0xcc0000)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
  },
};
