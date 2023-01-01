const {
  EmbedBuilder,
  version,
  Message,
  ChannelType,
  UserFlags,
} = require("discord.js");
const moment = require("moment");
const { connection } = require("mongoose");
require("moment-duration-format");
const os = require("os");
const TheTurBOT = require("../../structures/Client");

module.exports = {
  name: "status",
  category: "Information",
  aliases: ["stats"],
  description: "Displays bot status.",
  args: false,
  usage: "",
  userPerms: [],
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {string[]} args
   * @param {TheTurBOT} client
   * @param {string} prefix
   */
  execute: async (message, args, client, prefix) => {
    const formatter = new Intl.ListFormat("en-GB", {
      style: "long",
      type: "conjunction",
    });

    const status = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

    await client.user.fetch();
    await client.application.fetch();

    const getChannelTypeSize = (type) =>
      client.channels.cache.filter((channel) => type.includes(channel.type))
        .size;

    const embed = new EmbedBuilder()
      .setColor(0x2ef297)
      .setTitle(`${client.user.username}'s Status`)
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .addFields(
        {
          name: "Description",
          value: `<:icon_note:1035025429708414976> ${
            client.application.description || "None"
          }`,
        },
        {
          name: "General",
          value: [
            `👩🏻‍🔧 **Client** ${client.user.tag}`,
            `<:ID:1043141839689097216> **ID** ${client.user.id}`,
            `<:icons_calender:1043142009944277103> **Created** <t:${parseInt(
              client.user.createdTimestamp / 1000
            )}:R>`,
            `<a:tur_crown:1032890903070781460> **Owner** ${
              client.application.owner
                ? `<@${client.application.owner.id}> (${client.application.owner.tag})`
                : "None"
            }`,
            `<:verified:1043142305105858580> **Verified** ${
              client.user.flags & UserFlags.VerifiedBot ? "Yes" : "No"
            }`,
            `🏷 **Tags** ${
              client.application.tags.length
                ? formatter.format(
                    client.application.tags.map((tag) => `*${tag}*`)
                  )
                : "None"
            }`,
            `<:slash_cmd:1023859798736912405> **Commands** ${
              client.commands.size + 56
            }`,
          ].join("\n"),
        },
        {
          name: "System",
          value: [
            `<:system:1043142934117232730> **Operating System** ${os
              .type()
              .replace("Windows_NT", "Windows")
              .replace("Darwin", "macOS")}`,
            `<:clocks:1043143021111279626> **Up Since** <t:${parseInt(
              client.readyTimestamp / 1000
            )}:R>`,
            `<a:ping:1043146511858548736> **Ping** ${client.ws.ping}ms`,
            `<:cpu:1043144854739365909> **CPU Model** ${os.cpus()[0].model}`,
            `💾 **CPU Usage** ${(
              process.memoryUsage().heapUsed /
              1024 /
              1024
            ).toFixed(2)}%`,
            `<:database:1043145683944886352> **Database** ${
              status[connection.readyState]
            }`,
            `<:NodeJs:1043145190564700201> **Node.js** ${process.version}`,
            `<:DiscordJS:1043145091793047604> **Discord.js** ${version}`,
          ].join("\n"),
          inline: true,
        },
        {
          name: "MEMORY",
          value: `> **• Total Memory** : ${(
            os.totalmem() /
            1024 /
            1024
          ).toFixed(2)}mb
              > **• Free Memory** : ${(os.freemem() / 1024 / 1024).toFixed(
                2
              )}mb`,
        },
        {
          // Using the caches for some of these isn't always reliable, but it would be a waste of resources to loop through all servers every single time someone used this command.
          name: "Statistics",
          value: [
            `<:serverstats:1043144984179785788> **Servers** ${client.guilds.cache.size}`,
            `<:users:1043145827599790130> **Users** ${client.users.cache.size}`,
            `😏 **Emojis** ${client.emojis.cache.size}`,
            `<a:chat_chat_chat_chat:1043144519908065290> **Text Channels** ${getChannelTypeSize(
              [
                ChannelType.GuildText,
                ChannelType.GuildForum,
                ChannelType.GuildNews,
              ]
            )}`,
            `🎙 **Voice Channels** ${getChannelTypeSize([
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice,
            ])}`,
            `🧵 **Threads** ${getChannelTypeSize([
              ChannelType.GuildPublicThread,
              ChannelType.GuildPrivateThread,
              ChannelType.GuildNewsThread,
            ])}`,
          ].join("\n"),
          inline: true,
        }
      );
    message.reply({ embeds: [embed] });
  },
};
