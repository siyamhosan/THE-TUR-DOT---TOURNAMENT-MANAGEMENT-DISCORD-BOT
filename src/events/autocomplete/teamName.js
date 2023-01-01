const { Client } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {Client} client
   */
  run: async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (
      interaction.commandName === "result" &&
      interaction.options.getSubcommand() === "info"
    ) {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });

      if (!turOf) return;
      let matchListRaw = turOf.result_matchs;
      let matchAgainRaw = Object.values(matchListRaw)
        .flat()
        .map((x) => x.match);
      let matchList = Object.values(matchAgainRaw).flat();
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
      let data = Object.values(sortedList)
        .flat()
        .filter((el) => {
          return el.name !== (/ /gi || null || ""), el.killPoint !== null;
        });
      let teamS = data.map((x) => x.name);
      const focusedValue = interaction.options.getFocused();
      const filtered = [];
      teamS.filter((choice, idx) => {
        if (!choice.startsWith(focusedValue.toUpperCase()) || idx >= 23) return;
        return filtered.push(choice.toString());
      });
      if (filtered.length < 1) return;
      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.replace(/-/gm, " "),
          value: choice,
        }))
      );
    }
    if (
      interaction.commandName === "admin" &&
      interaction.options.getSubcommand() === "update"
    ) {
      const turOfDB = require("../../schema/turnamentSMAS");
      let turOf = await turOfDB.findOne({
        tur_pretent: interaction.channel.parentId,
      });

      if (!turOf) return;
      let squadnames = turOf.reg_list.map((x) => x.name);
      const focusedValue = interaction.options.getFocused();
      const filtered = [];
      squadnames.filter((choice, idx) => {
        if (!choice.startsWith(focusedValue.toUpperCase()) || idx >= 23) return;
        return filtered.push(choice.toString());
      });
      if (filtered.length < 1) return;
      await interaction.respond(
        filtered.map((choice) => ({
          name: choice.replace(/-/gm, " "),
          value: choice,
        }))
      );
    }
  },
};
