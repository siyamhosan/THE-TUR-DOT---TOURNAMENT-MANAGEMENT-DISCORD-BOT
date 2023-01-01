const { Client, Message, EmbedBuilder } = require("discord.js");
const storeOFDB = require("../../schema/storeofSMAS");
const turOfDB = require("../../schema/turnamentSMAS");

module.exports = {
  name: "messageCreate",
  /**
   * @param { Client } client
   * @param {Message} interaction
   */
  run: async (client, interaction) => {
    let storeOf = await storeOFDB.findOne({
      guildID: interaction.guildId,
    });
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    if (interaction.author.bot) return;
    if (!storeOf) return;
    if (interaction.content.toLowerCase().startsWith(storeOf.prefix)) {
      let messageData = interaction.content.slice(storeOf.prefix.length).trim();
      if (!turOf) return;

      if (messageData.toLowerCase().startsWith("addg")) {
        messageData = messageData.replace("addg", " ").trim();
        let groupName = messageData.split(/\s/gm)[0];
        let groupRole = messageData.split(/\s/gm)[1].replace(/\D/gm, "");

        let groups = turOf.groups_list;
        if (groups.map((x) => x.group_name).includes(groupName.toUpperCase()))
          return interaction.channel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error! <a:tur_error:1032255870567993364>")
                .setDescription("**Duplicate Group Found On This Name**")
                .setColor(0xea4819)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp(),
            ],
          });
        let newGroupInfoToStore = {
          group_name: groupName.toUpperCase(),
          group_roleId: groupRole,
        };
        let newGroupData = groups.concat([newGroupInfoToStore]);
        turOf.group_status = true;
        turOf.groups_list = newGroupData;
        turOf.save();
      } else if (messageData.toLowerCase().startsWith("delg")) {
        messageData = messageData.replace(/delg/gim, " ").trim();
        let groups = turOf.groups_list;
        let newGroupInfoToStore = [];
        if (
          groups
            .map((x) => x.group_name)
            .includes(interaction.options.get("name").value)
        ) {
        } else
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Error! <a:tur_error:1032255870567993364>")
                .setDescription("**No Group Found On This Name**")
                .setColor(0xea4819)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp(),
            ],
          });
        groups.forEach((x) => {
          if (
            x.group_name === interaction.options.get("name").value.toUpperCase()
          )
            return;
          return newGroupInfoToStore.push(x);
        });
        turOf.groups_list = newGroupInfoToStore;
        turOf.save();
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
              .setDescription("Successfully Deleted Group.")
              .setColor(0xff6600)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
        await client.channels.cache.get(turOf.tur_log).send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
              .setDescription("Successfully Deleted Group.")
              .setColor(0xff6600)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      }
    }
    //role giver
    if (!turOf) return;
    if (!turOf.group_status && interaction.channelId === turOf.group_channel)
      return interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Group Role is Currently Off.")
            .setDescription(
              "Tur Admin Need To Start Group Role.. \n<:slash_cmd:1023859798736912405>`admin group status <start/end>`"
            ),
        ],
      });
    if (
      interaction.content.toLowerCase().includes(":") &&
      interaction.channelId === turOf.group_channel &&
      turOf.group_status
    ) {
      try {
        var properties = interaction.content.split(/,?\n/gm);
        var obj = {};
        properties.forEach(function (property) {
          var tup = property.split(":");
          if (/group/i.test(tup[0])) {
            obj.group = tup[1].toUpperCase().trim();
          }
        });

        let group = obj.group.toUpperCase().trim();
        if (!group) {
          await interaction.react("<a:tur_redCheck:1017059852222218291>");
          await interaction.channel
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sorry!")
                  .setDescription("No Group Found"),
              ],
            })
            .then(async (msg) => {
              await new Promise((resolve) => setTimeout(resolve, 4000));
              msg.delete();
            });
        } else {
          let roleOf = turOf.groups_list;
          let roleID = roleOf.find(({group_name})=>group_name.toUpperCase() === group.toUpperCase()) ?? null
          if (!roleID) {
            return await interaction.react(
              "1017059852222218291"
            );
          }
          await interaction.member.roles.add(roleID.group_roleId);
          await interaction.react("1020702114198077471");
          await interaction.guild.channels.cache.get(turOf.tur_log).send({
            embeds: [
              new EmbedBuilder()
                .setTitle("Role Given! <a:tur_greenCheck:1020702114198077471>")
                .setDescription(
                  `Group: ${group}\nMessage:\`\`\`${interaction.content}\`\`\``
                )
                .setColor(0xff6600)
                .setAuthor({
                  name: interaction.author.username,
                  iconURL: interaction.author.displayAvatarURL(),
                })
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                })
                .setTimestamp(),
            ],
          });
        }
      } catch (e) {
        console.log(e);
        if (e.code === 50013) {
          interaction.channel.send({
            content: `Sorry, Unable to give role. Please Drag my role to top \n<@&${turOf.tur_mod}>`,
          });
          await interaction.reactions.removeAll();
          await interaction.react("1017059852222218291");
        }
      }
    }
  },
};
