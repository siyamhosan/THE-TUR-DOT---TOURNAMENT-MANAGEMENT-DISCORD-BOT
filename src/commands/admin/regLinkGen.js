const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");
const mongoose = require("mongoose");
const { wrongChannel } = require("../../helpers/embedMessages");

module.exports = {
  name: "reglink",
  aliases: ["reglinkget", "registrationlink"],
  category: "Registration",
  description: "Get custom website registration link",
  args: false,
  usage: "",
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    const shortofDB = require("../../schema/linkShortner");
    const turOfDB = require("../../schema/turnamentSMAS");

    let turOf = await turOfDB.findOne({
      tur_pretent: message.channel.parentId,
    });
    if (!turOf) {
      return message.reply({
        ephemeral: true,
        embeds: [wrongChannel],
      });
    }
    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return message.reply({
        embeds: [notAdminMessage],
      });
    }
    const shortOf = await shortofDB.findOne({ tur_id: turOf.tur_id });
    if (shortOf)
      return message.reply({
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
    message.reply({
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
