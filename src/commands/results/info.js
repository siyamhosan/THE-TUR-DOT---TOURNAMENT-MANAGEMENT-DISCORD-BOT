const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");
const { registerFont, createCanvas, loadImage } = require("canvas");
const { notAdminMessage } = require("../../helpers/embedMessages");
const mergeQuantities = (values) => {
  const mergeRes = {};
  values.forEach(({ name, boyyah, positionPoint, killPoint }) => {
    if (
      name.toLowerCase() === "null" ||
      name.toLowerCase() === "out" ||
      name.toLowerCase() === "undefined"
    ) {
      return;
    }
    mergeRes[name] = mergeRes[name] || {
      name,
      boyyah: 0,
      positionPoint: 0,
      killPoint: 0,
      total: 0,
      count: 1,
    };
    mergeRes[name].boyyah += boyyah;
    mergeRes[name].positionPoint += positionPoint;
    mergeRes[name].killPoint += killPoint;
    mergeRes[name].total =
      mergeRes[name].positionPoint + mergeRes[name].killPoint;
    mergeRes[name].count += 1;
  });

  return Object.values(mergeRes);
};
module.exports = {
  subCommand: "result.info",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();
    if (interaction.user.bot) return;
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB
      .findOne({ tur_pretent: interaction.channel.parentId })
      .catch(console.error);

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    let matchListRaw = turOf.result_matchs;
    let matchAgainRaw = Object.values(matchListRaw)
      .flat()
      .map((x) => x.match);
    let matchList = Object.values(matchAgainRaw).flat();

    if (interaction.options.get("squad")) {
      let teamName = interaction.options.get("squad").value;

      let teamSmatchList = matchList.filter(
        (x) => x.name === teamName.replace(" ", /-/gm)
      );
      let matchCountArrayString = [];
      teamSmatchList.forEach((el) => {
        matchCountArrayString.push(
          `Name: ${el.name} - WIN: ${el.boyyah} - Position Pts: ${el.positionPoint} - Kill Pts: ${el.killPoint}`
        );
      });
      if (teamSmatchList.length < 1)
        return interaction.editReply({
          embeds: [notAdminMessage.setTitle("No Squad Found On This Name")],
        });
      let teamSList = mergeQuantities(teamSmatchList);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${teamSList.map((x) => x.name)}`)
            .setDescription(`Match Count : ${teamSmatchList.length}`)
            .addFields(
              {
                name: "Total Information",
                value: `<a:tur_crown:1032890903070781460> WIN: ${teamSList.map(
                  (x) => x.boyyah
                )}\n<:tur_kill:1032891302448209940> KILL: ${teamSList.map(
                  (x) => x.killPoint
                )}\n<:tur_position:1032891523781627905> POSITION: ${teamSList.map(
                  (x) => x.positionPoint
                )}\n<:tur_plush:1032894222531051571> TOTAL: ${teamSList.map(
                  (x) => x.total
                )}`,
                inline: true,
              },
              {
                name: "Matchs",
                value: `${matchCountArrayString.join("\n")}`,
              }
            )
            .setColor(0xff6600)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }

    if (matchList.length < 1) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Match's Found")
            .setDescription("Please Add match's before asking results")
            .setColor(0x4281ff)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    // merge
    let matchSCount = matchAgainRaw.length;
    let sortedList = mergeQuantities(matchList).sort((a, b) => b.name - a.name);
    let data = Object.values(sortedList)
      .flat()
      .filter((el) => {
        return el.name !== (/ /gi || null || ""), el.killPoint !== null;
      });

    let matchCountArray = [];
    data.forEach((x, idx) => {
      let string = `${idx + 1}. ${x.name} - ${x.count}`;
      return matchCountArray.push(string);
    });
    interaction.editReply({
      content:
        "<a:tur_right_arrow:1016656565375340584> **Results Informations** <a:tur_done:1015661729109254164> ",
      embeds: [
        new EmbedBuilder()
          .setTitle("Matchs")
          .setDescription(`Matchs Counted: ${matchSCount}`)
          .addFields({
            name: "Teams Played",
            value: `${matchCountArray
              .forEach((el) => {
                return `Name: ${el.name} - WIN: ${el.boyyah} - Position Pts: ${el.positionPoint}} - Kill Pts: ${el.killPoint}`;
              })
              .join("\n")}`,
          })
          .setColor(0xff6600),
      ],
    });
  },
};
