const {
  Client,
  Message,
  PermissionFlagsBits,
  EmbedBuilder,
  Colors,
  Events,
  ChannelType,
} = require("discord.js");
const { notAdminMessage } = require("../../helpers/embedMessages");
const storeOfDB = require("../../schema/storeofSMAS");
module.exports = {
  name: "channellock",
  category: "Moderation",
  aliases: ["clock", "lockout"],
  description: "Lock Channel for everyone",
  args: false,
  usage: "<channel mention or id>",
  userPerms: [PermissionFlagsBits.ManageGuild],
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    let storeOf = await storeOfDB.findOne({ guildID: message.guildId });
    if (!storeOf) return;
    let spliter;

    try {
      let channel =
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.channel;

      let alreadyLockedMessage = new EmbedBuilder()
        .setColor(Colors.Red)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTitle(
          `<a:tur_error:1032255870567993364> **This Channel is Already locked!**`
        )
        .setDescription(
          `This usually means, that the Channel **PERMISSIONS** are so defined, that __none__ of them are NOT ALLOWING to send a Message!`
        );

      if (channel.type === ChannelType.GuildText) {
        if (
          channel
            .permissionsFor(message.guild.roles.everyone.id)
            .has("SendMessages") === false
        )
          return message.reply({
            embeds: [alreadyLockedMessage],
          });
        channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
          SendMessages: false,
          AddReactions: false,
        });
      } else if (channel.type === ChannelType.GuildVoice) {
        if (
          channel
            .permissionsFor(message.guild.roles.everyone.id)
            .has("Connect") === false
        )
          return message.reply({ embeds: [alreadyLockedMessage] });
        channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
          Connect: false,
        });
      } else if (channel.isThread()) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xff0000)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTitle(
                `<a:tur_error:1032255870567993364> **This Channel is a Thread u can't Lock it!**`
              ),
          ],
        });
      }
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Aqua)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle(
              `<:locked:1038367102995812374> **Successfully locked \`${channel.name}\`**`
            ),
        ],
      });
    } catch (e) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(Colors.Red)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTitle("<a:cp_offline:1013374446263869470> An error occurred")
            .setDescription(`\`\`\`${e.stack}\`\`\``),
        ],
      });
    }
  },
};
