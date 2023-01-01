const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const storeofSMAS = require("../../schema/storeofSMAS");
module.exports = {
  subCommand: "tour.temp",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    let messageEmbed = new EmbedBuilder()
      .setTitle("**Temporary tournament created**")
      .setDescription(`This Temporary tournament is only for this channel`)
      .setColor(0x24ff00)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    const turOfDB = require("../../schema/turnamentSMAS");
    const mongoose = require("mongoose");
    interaction.editReply({ embeds: [messageEmbed] });
    let storeOf = await storeofSMAS.findOne({ guildID: interaction.guildId });
    if (storeOf.logChannel !== "000") {
      await client.channels.cache.get(storeOf.logChannel).send({
        embeds: [
          new EmbedBuilder()
            .setTitle("New Tour Created")
            .setDescription(
              `Temporary Tournament created. **Auto Deleting in 3 hours**`
            )
            .setColor(0xf96819)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    await turOfDB
      .create({
        _id: mongoose.Types.ObjectId(),
        tur_name: "Temporary",
        guildID: interaction.guildId,
        guildname: interaction.guild.name,
        tur_manage: interaction.channelId,
        tur_pretent: interaction.channel.parentId,
      })
      .then(async (tour) => {
        await new Promise((resolve) => setTimeout(resolve, 900000)); //10800000
        tour.delete();
        if (storeOf.logChannel !== "000") {
          await client.channels.cache.get(storeOf.logChannel).send({
            embeds: [
              new EmbedBuilder()
                .setTitle("New Tour Deleted")
                .setDescription(`Temporary Tournament Deleted.`)
                .setColor(0xf55427)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
          });
        }
      });
  },
};
