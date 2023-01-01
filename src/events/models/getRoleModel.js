const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Client,
  EmbedBuilder,
} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");

module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isModalSubmit) return;

    if (interaction.customId === "getGroupRoleModel") {
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });
      try {
        let group = interaction.fields.getTextInputValue("modalGroupName");
        let team = interaction.fields.getTextInputValue("modalTeamName");

        let roleOf = turOf.groups_list;
        let roleID;
        roleOf.forEach(function (gl) {
          if (gl.group_name === group) {
            roleID = gl.group_roleId;
          } else {
            roleID = null;
          }
        });
        if (!roleID) {
          return await interaction.channel.send({
            content: "No Group Found!!",
            ephemeral: true,
          });
        }
        await interaction.member.roles.add(roleID);
        await interaction.reply({
          embeds: [
            new EmbedBuilder({
              title: "Group Role Given!! <a:tur_blt:1034733773817909308>",
              description: `Group Name: ${group}\nTeam Name: ${team}\nTo: ${interaction.user.username}`,
              color: 0x26ff4a,
              footer: {
                text: client.user.username,
                icon_url: client.user.displayAvatarURL(),
              },
            }),
          ],
        });
        await interaction.guild.channels.cache.get(turOf.tur_log).send({
          embeds: [
            new EmbedBuilder()
              .setTitle("Role Given! <a:tur_greenCheck:1020702114198077471>")
              .setDescription(`Group: ${group}\nTeam Name:${team}`)
              .setColor(0xff6600)
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
              })
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      } catch (e) {
        console.log(e);
        if (e.code === 50013) {
          interaction.channel.send({
            content: `Sorry, Unable to give role. Please Drag my role to top \n<@&${turOf.tur_mod}>`,
          });
          await interaction.reactions.removeAll();
          await interaction.react("<a:tur_redCheck:1017059852222218291>");
        }
      }
    }
  },
};
