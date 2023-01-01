const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  AttachmentBuilder,
} = require("discord.js");

const {
  notAdminMessage,
  wrongChannel,
} = require("../../helpers/embedMessages");
module.exports = {
  subCommand: "result.getbenner",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */

  run: async (client, interaction) => {
    await interaction.deferReply();
    if (interaction.user.bot) return;
    if (!interaction.isChatInputCommand()) return;
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
    if (!turOf) return interaction.editReply({ embeds: [wrongChannel] });

    if (
      interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      interaction.member.roles.includes(turOf.tur_mod)
    ) {
    } else {
      return interaction.editReply({
        embeds: [notAdminMessage],
      });
    }
    let matchListRaw = turOf.result_matchs;
    if (interaction.options.getNumber("match")) {
      matchListRaw =
        turOf.result_matchs[interaction.options.getNumber("match")].match;
    }
    let matchAgainRaw = Object.values(matchListRaw)
      .flat()
      .map((x) => x.match);
    let matchList = Object.values(matchAgainRaw).flat();
    if (matchList.length < 1 || matchList == undefined || matchList == null) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Match's Found")
            .setDescription("Please Add match's before asking results")
            .setColor(client.wrongColor)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    // merge
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
          count: 0,
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
    let sortedList = mergeQuantities(matchList).sort(
      (a, b) => b.total - a.total
    );
    if (sortedList.length <= 0 || sortedList == undefined) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("No Match's Found")
            .setDescription("Please Add match's before asking results.")
            .setColor(0xf55427)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }
    let data = Object.values(sortedList)
      .flat()
      .filter((el) => {
        return el.name !== (/ /gi || null || ""), el.killPoint !== null;
      });
    const { tamplate1 } = require("../../helpers/tamplates/temp1");
    let benner_data = turOf.result_benner;
    let matchCountArray = [];
    data.forEach((x, idx) => {
      let string = `${idx + 1}. ${x.name}`;
      return matchCountArray.push(string);
    });
    try {
      console.log({data,benner_data})
      var canvasToBuffer = (await tamplate1(data, benner_data)).toBuffer();
    } catch (e){
      if(e) return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(e.msg)
            .setDescription("Sorry you have uploaded a unsupported background!\nPlease try sending image to discord message then download from message and upload again to bot")
            .setColor(client.wrongColor)
            .setTimestamp()
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      })
    }
    let imageAttasment = new AttachmentBuilder()
      .setFile(canvasToBuffer)
      .setName("results.png");
    interaction.editReply({
      content:
        "<a:tur_right_arrow:1016656565375340584> **Results generated successfully** <a:tur_done:1015661729109254164> ",
      files: [imageAttasment],
      embeds: [
        new EmbedBuilder()
          .setTitle(
            "<a:tur_gw:1035104601625600040> Results by Text <a:tur_blt:1034733773817909308> "
          )
          .addFields({
            name: "Rank - Team Name",
            value: `\`\`\`js\n${matchCountArray.join("\n")}\`\`\``,
          })
          .setColor(0xff6600)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
    });
  },
};
