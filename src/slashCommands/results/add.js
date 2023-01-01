const {
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
module.exports = {
  subCommand: "result.add",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();

    const turOfDB = require("../../schema/turnamentSMAS");
    const storeOfDB = require("../../schema/storeofSMAS");
    let turOf = await turOfDB
      .findOne({ tur_pretent: interaction.channel.parentId })
      .catch(console.error);
    let storeOf = await storeOfDB.findOne({ guildID: interaction.guildId });
    //Prosses Started Message
    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    if (!turOf) {
      return interaction.editReply({
        embeds: [wrongChannel],
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
      killPoint: parseInt(+team.split(/\s+/)[1]),
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
    let date = new Date();

    let matchs = turOf.result_matchs;
    matchs.push({
      match: sortedData,
      map: interaction.options.getString("map"),
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
    });

    turOf.result_matchs = matchs;
    await turOf.save().catch((err) => {
      interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title:
              "Hey! There's something wrong with your attempt, please try again with corrections",
          })
            .addFields(
              {
                name: "The validation failed!. Here is your request:",
                value: `\`\`\`js\n${interaction.options.getString(
                  "string"
                )}\`\`\``,
              },
              {
                name: "Here are some things you should know:",
                value:
                  "<a:tur_right_arrow:1016656565375340584> **1.Separate With** `,`\n\n> Team-name kill\n\nTeam1 5,\nTeam2 6\n\n<a:tur_right_arrow:1016656565375340584> **2.No Space in Team name only (-)**\n\nTeam-1 5,\nTeam-2 6\n\n<a:tur_right_arrow:1016656565375340584> **3. no** `,` **at last team**\n\nTeam-1 6,\nTeam-2 7,\nTeam-9 8,\nTeam-10 0",
              }
            )
            .setColor(0xf55427)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
      throw new Error("New Akjon Vull Result Submit Korse. Innalillah!");
    });
    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            "**Match Info Added successfully **<a:tur_done:1015661729109254164> "
          )
          .setColor(0x45fd1b)
          .setDescription(
            turOf.result_matchs.length + " **No. Match info Added**"
          )
          .addFields(
            { name: "Map", value: interaction.options.getString("map") },
            {
              name: "Preview String",
              value: `\`\`\`js\n${interaction.options.getString(
                "string"
              )}\`\`\``,
            }
          )
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          }),
      ],
    });
    if (!turOf.tur_log) return;
    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Match Info Added")
          .setColor(0x999999)
          .setDescription(
            turOf.result_matchs.length + " **No. Match info Added**"
          )
          .addFields(
            { name: "Map", value: interaction.options.getString("map") },
            {
              name: "Preview String",
              value: `\`\`\`js\n${interaction.options.getString(
                "string"
              )}\`\`\``,
            }
          )
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  },
};
