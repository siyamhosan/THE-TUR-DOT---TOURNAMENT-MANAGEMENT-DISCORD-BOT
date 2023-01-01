const { ChatInputCommandInteraction, client, Client } = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS");
const stickOfDB = require("../../schema/stickyMessageSMAS");
module.exports = {
  subCommand: "tour.delete",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    try {
      let turOf = await turOfDB.findOne({
        tur_id: interaction.options.get("tour-id").value,
      });
      if (!turOf)
        return interaction.reply({ content: "No Tournament Found On This Id" });

      await turOfDB.findOneAndDelete({
        tur_id: interaction.options.get("tour-id").value,
      });
      await stickOfDB.findOneAndDelete({
        tur_id: interaction.options.get("tour-id").value,
      });
      let catagory = client.channels.cache.get(turOf.tur_pretent);
      if (!catagory)
        return interaction.reply({ content: "No Tournament Found" });
      catagory.children.cache.forEach((channel) => channel.delete());
      await catagory.delete();
      await interaction.reply({
        content: "Tournament Deleted",
        ephemeral: true,
      });
    } catch (e) {
      console.log(e);
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setTitle("Error! <:tur_error:1027176125518073876> ")
            .setDescription(`${e}`)
            .setColor(0x913a00)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp(),
        ],
      });
    }
  },
};
