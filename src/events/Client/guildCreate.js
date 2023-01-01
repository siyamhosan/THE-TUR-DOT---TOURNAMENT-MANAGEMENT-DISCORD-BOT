const { ChannelType, EmbedBuilder } = require("discord.js");
const moment = require("moment");
const mongoose = require("mongoose");
const storeofDB = require("../../schema/storeofSMAS");
module.exports = {
  name: "guildCreate",
  run: async (client, guild) => {
    const channel = client.channels.cache.get(client.config.logs);
    let own = await guild?.fetchOwner();
    let text;
    guild.channels.cache.forEach((c) => {
      if (c.type === ChannelType.GuildText && !text) text = c;
    });
    const invite = await text.createInvite({
      reason: `For ${client.user.tag} Developer(s)`,
      maxAge: 0,
    });
    const embed = new EmbedBuilder()
      .setThumbnail(guild.iconURL({ size: 1024 }))
      .setTitle(`📥 Joined a Guild !!`)
      .setColor(client.successColor)
      .addFields([
        { name: "Name", value: `\`${guild.name}\`` },
        { name: "ID", value: `\`${guild.id}\`` },
        {
          name: "Owner",
          value: `\`${
            guild.members.cache.get(own.id)
              ? guild.members.cache.get(own.id).user.tag
              : "Unknown user"
          }\` ${own.id}`,
        },
        { name: "Member Count", value: `\`${guild.memberCount}\` Members` },
        {
          name: "Creation Date",
          value: `\`${moment.utc(guild.createdAt).format("DD/MMM/YYYY")}\``,
        },
        {
          name: "Guild Invite",
          value: `[Here is ${guild.name} invite ](https://discord.gg/${invite.code})`,
        },
        {
          name: `${client.user.username}'s Server Count`,
          value: `\`${client.guilds.cache.size}\` Servers`,
        },
      ])
      .setTimestamp();
    channel.send({ embeds: [embed] });

    let storeOf = await storeofDB.findOne({ guildID: guild.id });
    if (storeOf) {
      storeofDB.findOneAndUpdate(
        { guildID: guild.id },
        {
          _id: mongoose.Types.ObjectId(),
          guildID: guild.id,
          guildname: guild.name,
          prefix: "?",
          regChannel: "000",
          logChannel: "000",
          resultChannel: "000",
          roleChannel: "000",
          atRegChannel: "000",
          idpassChannel: "000",
          allowedAdminRoles: "000",
          isPremeum: false,
          autoEmbed: [],
        }
      );
    } else {
      await storeofDB.create({
        _id: mongoose.Types.ObjectId(),
        guildID: guild.id,
        guildname: guild.name,
        prefix: "ig?",
        regChannel: "000",
        logChannel: "000",
        resultChannel: "000",
        roleChannel: "000",
        atRegChannel: "000",
        idpassChannel: "000",
        allowedAdminRoles: "000",
        isPremeum: false,
        autoEmbed: [],
      });
    }
  },
};
