const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  subCommand: "result.update",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();
    if (interaction.user.bot) return;
    let messageData;
    let matchNumber = interaction.options.get("number").value;

    const turOfDB = require("../../schema/turnamentSMAS");
    const storeOfDB = require("../../schema/storeofSMAS");
    let turOf = await turOfDB
      .findOne({ tur_pretent: interaction.channel.parentId })
      .catch(console.error);
    let storeOf = await storeOfDB.findOne({ guildID: interaction.guildId });
    //Prosses Started Message

    if (!turOf) return interaction.editReply({ embeds: wrongChannel });

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.includes(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            "Match Info Added To be Processes <a:tur_loading:1015661123602743448>"
          )
          .setDescription("It will take a sec to complete")
          .setTimestamp()
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
    //convert
    let tocoverteData = interaction.options
      .get("string")
      .value.split(/,\s?\n?/gim);

    let converter = tocoverteData.map((team) => ({
      name: team.split(/\s+/)[0],
      killPoint: +team.split(/\s+/)[1],
    }));
    let boyyahCounts = [1];
    let pointsystem = [12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0];
    if (turOf.result_pointSystem.length > 1) {
      pointsystem = turOf.result_pointSystem;
    }
    const positionAdd = (objects) => {
      const posRes = objects.map(({ name, killPoint }, idx) => ({
        name,
        boyyah: boyyahCounts[idx] ?? 0,
        positionPoint: pointsystem[idx] ?? 0,
        killPoint,
      }));
      return posRes;
    };
    let sortedData = positionAdd(converter).filter((el) => {
      return el.name !== /\s/g || null || "undifined";
    });
    let matchs = turOf.result_matchs;

    var foundIndex = matchs.findIndex((x, idx) => idx === matchNumber);

    let messageUp = new EmbedBuilder()
      .setTitle(
        "**Match Info Updated successfully **<a:tur_done:1015661729109254164> "
      )
      .setColor(0x45fd1b)
      .setDescription(foundIndex + 1 + " **No. Match info Updated!**")
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields({
        name: "Old Match : " + matchs[foundIndex].map,
        value: `\`\`\`js\n${matchs[foundIndex].match.join("\n")}\`\`\``,
      });

    let date = new Date();
    matchs[foundIndex] = {
      match: sortedData,
      map: matchs[foundIndex].map,
      date:
        date.toLocaleTimeString("en-US", { hour: "numeric" }) +
        ":" +
        date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
        ":" +
        date.toLocaleTimeString("en-US", { second: "2-digit" }) +
        "/" +
        date.toLocaleDateString("en-US", { day: "numeric" }) +
        "/" +
        date.toLocaleDateString("en-US", { month: "long" }),
    };

    turOf.result_matchs = matchs;
    await turOf.save();
    messageUp.addFields({
      name: "New Match : " + turOf.result_matchs[foundIndex].map,
      value: `\`\`\`js\n${turOf.result_matchs[foundIndex].match.join(
        "\n"
      )}\`\`\``,
    });
    interaction.editReply({
      embeds: [messageUp],
    });
    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Match Info Updated")
          .setColor(0x999999)
          .setDescription(foundIndex + 1 + " **No. Match info Updated**")
          .addFields({
            name: "Preview String",
            value: `\`\`\`js\n${interaction.options.getString("string")}\`\`\``,
          })
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });

    const { provider } = require("../../helpers/bennerProvider");
    const benner = await provider(turOf);
    if (benner) {
      interaction.channel.send({
        content: "Preview",
        files: [benner],
      });
    }
  },
};
