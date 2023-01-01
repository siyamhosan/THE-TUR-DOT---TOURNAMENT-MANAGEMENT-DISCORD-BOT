const {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const storeofSMAS = require("../../schema/storeofSMAS");
module.exports = {
  subCommand: "tour.create",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    let user = interaction.options.get("tour-name").value;
    let permissions = [
      PermissionFlagsBits.ViewChannel,
      PermissionFlagsBits.SendMessages,
      PermissionFlagsBits.ModerateMembers,
      PermissionFlagsBits.BanMembers,
      PermissionFlagsBits.ChangeNickname,
      PermissionFlagsBits.ManageMessages,
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.CreateInstantInvite,
      PermissionFlagsBits.UseApplicationCommands,
      PermissionFlagsBits.ReadMessageHistory,
      PermissionFlagsBits.MentionEveryone,
      PermissionFlagsBits.ManageChannels,
    ];
    //category create
    let guild = await client.guilds.cache.get(interaction.guildId);
    let pretentID;
    let registration;
    let paycheck;
    let help;
    let getRole;
    let log;
    let manage;
    let modeRoleS;
    let regLimit;
    let bennerUrl;

    let dateNow = performance.now();
    let tempIID = `TUR${dateNow}`;
    let turID = tempIID.slice(0, 12).trim();
    if (!interaction.options.get("mode-role")) {
      modeRoleS = guild.ownerId;
    } else {
      modeRoleS = interaction.options.get("mode-role").value;
    }
    if (!interaction.options.get("slots")) {
      regLimit = 12;
    } else {
      regLimit = interaction.options.get("slots").value;
    }
    if (!interaction.options.get("tour-benner")) {
      bennerUrl = null;
    } else {
      bennerUrl = interaction.options.get("tour-benner").attachment.url;
    }
    await guild.channels
      .create({
        name: user,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: [PermissionFlagsBits.SendMessages],
          },
          {
            id: interaction.guild.roles.everyone.id,
            allow: [
              PermissionFlagsBits.UseApplicationCommands,
              PermissionFlagsBits.UseExternalEmojis,
              PermissionFlagsBits.EmbedLinks,
            ],
          },
          {
            id: modeRoleS,
            allow: permissions,
          },
        ],
      })
      .then((category) => {
        pretentID = category.id;
      });
    await guild.channels.create({
      name: "╭।।𝐀𝐧𝐧𝐨𝐮𝐧𝐜𝐞𝐦𝐞𝐧𝐭",
      type: ChannelType.GuildText,
      parent: `${pretentID}`,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.SendMessages],
        },
        {
          id: modeRoleS,
          allow: permissions,
        },
      ],
      position: 1,
    });
    await guild.channels.create({
      name: "├।।𝐆𝐫𝐨𝐮𝐩𝐬",
      parent: `${pretentID}`,
      position: 3,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.SendMessages],
        },
        {
          id: modeRoleS,
          allow: permissions,
        },
      ],
      type: ChannelType.GuildText,
    });
    await guild.channels.create({
      name: "├।।𝐒𝐜𝐡𝐞𝐝𝐮𝐥𝐞",
      parent: `${pretentID}`,
      position: 4,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [PermissionFlagsBits.SendMessages],
        },
        {
          id: modeRoleS,
          allow: permissions,
        },
      ],
      type: ChannelType.GuildText,
    });
    await guild.channels
      .create({
        name: "├।।𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧",
        parent: `${pretentID}`,
        position: 2,

        type: ChannelType.GuildText,
      })
      .then((channel) => (registration = channel.id));
    if (interaction.options.get("payment").value) {
      await guild.channels
        .create({
          name: "├।।𝐏𝐚𝐲-𝐂𝐡𝐞𝐜𝐤",
          parent: `${pretentID}`,
          position: 10,
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
            {
              id: modeRoleS,
              allow: permissions,
            },
          ],
          type: ChannelType.GuildText,
        })
        .then((channel) => (paycheck = channel.id));
    } else paycheck = "000";
    await guild.channels
      .create({
        name: "├।।𝐇𝐞𝐥𝐩",
        parent: `${pretentID}`,
        position: 5,

        type: ChannelType.GuildText,
      })
      .then((channel) => (help = channel.id));
    await guild.channels
      .create({
        name: "├।।𝐆𝐞𝐭-𝐑𝐨𝐥𝐞",
        parent: `${pretentID}`,
        position: 6,

        type: ChannelType.GuildText,
      })
      .then((channel) => (getRole = channel.id));
    await guild.channels
      .create({
        name: "├।।𝐋𝐨𝐠",
        parent: `${pretentID}`,
        position: 7,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: modeRoleS,
            allow: permissions,
          },
        ],
        type: ChannelType.GuildText,
      })
      .then((channel) => (log = channel.id));
    await guild.channels
      .create({
        name: "├।।𝐌𝐚𝐧𝐚𝐠𝐞",
        parent: `${pretentID}`,
        position: 8,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone.id,
            deny: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ],
          },
          {
            id: modeRoleS,
            allow: permissions,
          },
        ],
        type: ChannelType.GuildText,
      })
      .then((channel) => (manage = channel.id));
    await guild.channels.create({
      name: "╰।।𝐒𝐮𝐩𝐩𝐨𝐫𝐭-𝐕𝐂",
      parent: `${pretentID}`,
      position: 9,
      permissionOverwrites: [{ id: modeRoleS, allow: permissions }],
      type: ChannelType.GuildVoice,
    });
    let messageEmbed = new EmbedBuilder()
      .setTitle("**New tournament created**")
      .setDescription(
        `Tournament id is: ||${turID}||\nYou needed this id to manage this tur`
      )
      .addFields(
        { name: "**Cetagory Info**", value: `**<#${pretentID}>**` },
        {
          name: "**Useful Channel's**",
          value: `**Registration: <#${registration}>\nHelp: <#${help}>\nGroups: <#${getRole}>\nLog: <#${log}>\nManagement: <#${manage}>**`,
        },
        {
          name: "**Edit's**",
          value:
            "You can rename or delete those channel's but deleting useful channel's is not suggested",
        }
      )
      .setColor(0x24ff00)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    const turOfDB = require("../../schema/turnamentSMAS");
    const mongoose = require("mongoose");

    await turOfDB.create({
      _id: mongoose.Types.ObjectId(),
      tur_id: turID,
      guildID: interaction.guildId,
      guildname: interaction.guild.name,
      tur_name: interaction.options.get("tour-name").value,
      tur_benner: bennerUrl,
      tur_mod: modeRoleS,
      tur_pretent: pretentID,
      tur_cretaed: new Date(),
      tur_log: log,
      tur_manage: manage,
      reg_limit: regLimit,
      reg_status: "notSt",
      reg_channel: registration,
      reg_payment: interaction.options.get("payment").value,
      reg_payment_check: paycheck,
      reg_system: "slash",
      result_pointSystem: [],
      result_matchs: [
        {
          match: [],
        },
      ],
      group_status: false,
      group_channel: getRole,
    });
    await interaction.guild.channels.cache.get(manage).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("**Turnament Helper <:tur_staff:1024305146588581958>**")
          .addFields(
            {
              name: "<a:tur_ra:1024316087938076712>**Registration:**",
              value:
                "You can registration in 2 ways.\n<a:animated_arrow:1024306395740385351> 1.By Slash\nCmd: <:slash_cmd:1023859798736912405>`reg <team_name> <team_member_list> <team_logo>`\n<a:animated_arrow:1024306395740385351> 2. By Modal's Work as a form can be customize as you want requirements to register.\nCmd: <:slash_cmd:1023859798736912405>`create reg-form <options>`\n<a:animated_arrow:1024306395740385351> Set your registration system with\nCmd: <:slash_cmd:1023859798736912405>`set regsye <slash/modal>`",
            },
            {
              name: "<a:tur_ra:1024316087938076712>**For Paid Tournament** (On Maintainance)",
              value:
                "You have to set payment to `true` <:tur_enable:1024308676179275836> when creating a new tournament.\nAfter that to setup payment methods use,\nAdding, remove, getting list or reset\n<:line:1024317133997494342> Adding: <:slash_cmd:1023859798736912405>`pay add <method_name:> <method_id>`\n<:line:1024317133997494342> Removing: <:slash_cmd:1023859798736912405>`pay del <method_id>`\n<:line:1024317133997494342> Get list: <:slash_cmd:1023859798736912405>`pay list`\n<:line:1024317133997494342> Resetting: <:slash_cmd:1023859798736912405>`pay reset`",
            },
            {
              name: "<a:tur_ra:1024316087938076712> **For Sticky message**",
              value:
                "Stick message used to note some message on a channel. You can stick a payment info or registration requirements or others with it.\nMethods you can use,\n<:line:1024317133997494342> Adding: <:slash_cmd:1023859798736912405>`stick add <channel:>  <message_title:> <message_description>`\n<:line:1024317133997494342> Removing: <:slash_cmd:1023859798736912405>`stick del <channel>`\n<:line:1024317133997494342> Reset: <:slash_cmd:1023859798736912405>`stick reset`",
            },
            {
              name: "<a:tur_ra:1024316087938076712> **Scheduler**",
              value:
                "With this you can schedule any event. Methods:\n<:line:1024317133997494342> Set: <:slash_cmd:1023859798736912405>`sched set <registration> <start/end/pause/resume>`\n<:line:1024317133997494342> Removing: <:slash_cmd:1023859798736912405>`sched del <registration> <start/end/pause/resume>`\n<:line:1024317133997494342> Reset: <:slash_cmd:1023859798736912405>`sched reset`\n**[Note: You Can Only Use This Command At Tur Manage Channel ]**",
            }
          )
          .setColor(0x31ffae)
          .setTimestamp()
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
    await interaction.editReply({ embeds: [messageEmbed] });

    let storeOf = await storeofSMAS.findOne({ guildID: interaction.guildId });
    if (storeOf.logChannel !== "000") {
      await client.channels.cache.get(storeOf.logChannel).send({
        embeds: [
          new EmbedBuilder()
            .setTitle("New Tour Created")
            .setDescription(
              `Tournament id is: ||${turID}||\nYou needed this id to manage this tur`
            )
            .setColor(0x22ff46)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    let turOf = await turOfDB.findOne({ tur_id: turID });
  },
};
