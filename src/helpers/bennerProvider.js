const { AttachmentBuilder } = require("discord.js");

module.exports = {
  provider: async (turOf) => {
    let matchListRaw = turOf.result_matchs;
    let matchAgainRaw = Object.values(matchListRaw)
      .flat()
      .map((x) => x.match);
    let matchList = Object.values(matchAgainRaw).flat();
    if (matchList.length < 1 || matchList == undefined || matchList == null) {
      return null;
    }

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
      return null;
    }
    let data = Object.values(sortedList)
      .flat()
      .filter((el) => {
        return el.name !== (/ /gi || null || ""), el.killPoint !== null;
      });
    const { tamplate1 } = require("./tamplates/temp1");
    let benner_data = turOf.result_benner;
    let matchCountArray = [];
    data.forEach((x, idx) => {
      let string = `${idx + 1}. ${x.name}`;
      return matchCountArray.push(string);
    });
    let canvasToBuffer = (await tamplate1(data, benner_data)).toBuffer();
    let imageAttasment = new AttachmentBuilder()
      .setFile(canvasToBuffer)
      .setName("results.png");
    return imageAttasment;
  },
};
