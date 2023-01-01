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
  subCommand: "result.benner-customize",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    if (interaction.user.bot) return;
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });
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
    let dataToStore = turOf.result_benner;

    let checker = /^#([0-9a-f]{3}){1,2}$/i;
    const options = interaction.options;
    if (options.get("background")) {
      dataToStore.customBack_link = options.get("background").attachment.url;
    }
    if (options.get("hadder-text")) {
      dataToStore.hadder_text = options.get("hadder-text").value.toUpperCase();
    }
    if (options.get("hadder-color")) {
      if (!checker.test(options.get("hadder-color").value))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error! <:tur_error:1027176125518073876> ")
              .setDescription(
                "Please check the hex color code on hadder-color. To get hex color you can use [hex color](https://www.color-hex.com/)"
              )
              .setColor(0x913a00)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      dataToStore.hadder_color = options.get("hadder-color").value;
    }
    if (options.get("dis-text")) {
      dataToStore.dis_text = options.get("dis-text").value.toUpperCase();
    }
    if (options.get("dis-color")) {
      if (!checker.test(options.get("dis-color").value))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Error! <:tur_error:1027176125518073876> ")
              .setDescription(
                "Please check the hex color code on dis-color. To get hex color you can use [hex color](https://www.color-hex.com/)"
              )
              .setColor(0x913a00)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      dataToStore.dis_color = options.get("dis-color").value;
    }
    if (options.get("result-color")) {
      if (!checker.test(options.get("result-color").value))
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Sorry! <:tur_error:1027176125518073876> ")
              .setDescription(
                "Please check the hex color code on result-color. To get hex color you can use [hex color](https://www.color-hex.com/)"
              )
              .setColor(0xf55427)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setTimestamp(),
          ],
        });
      dataToStore.topRow_color = options.get("result-color").value;
    }
    turOf.result_benner = dataToStore;
    await turOf.save();

    let messageCus = new EmbedBuilder()
      .setTitle(
        "Successfully Saved Customizetion <a:tur_greenCheck:1020702114198077471>"
      )
      .setColor(0x2ef297)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    let stringEdited = [];
    if (interaction.options.getString("hadder-text"))
      stringEdited.push(
        `<a:tur_right_arrow:1016656565375340584> **Hadder Text Changed : **\`${interaction.options.getString(
          "hadder-text"
        )}\``
      );
    if (interaction.options.getString("hadder-color"))
      stringEdited.push(
        `<a:tur_right_arrow:1016656565375340584> **Hadder Color Changed : **\`${interaction.options.getString(
          "hadder-color"
        )}\``
      );
    if (interaction.options.getString("dis-text"))
      stringEdited.push(
        `<a:tur_right_arrow:1016656565375340584> **Description Text Changed : **\`${interaction.options.getString(
          "dis-text"
        )}\``
      );
    if (interaction.options.getString("dis-color"))
      stringEdited.push(
        `<a:tur_right_arrow:1016656565375340584> **Description Color Changed : **\`${interaction.options.getString(
          "dis-color"
        )}\``
      );
    if (interaction.options.getString("result-color"))
      stringEdited.push(
        `<a:tur_right_arrow:1016656565375340584> **Benner Top Color Changed : **\`${interaction.options.getString(
          "result-color"
        )}\``
      );
    if (interaction.options.getAttachment("background")) {
      stringEdited.push(
        `<a:tur_down_arrow:1043027409022238740> **Background Channged** <a:tur_down_arrow:1043027409022238740>`
      );
      messageCus.setImage(
        interaction.options.getAttachment("background").proxyURL
      );
    }
    if (stringEdited.length >= 1) {
      messageCus.setDescription(stringEdited.join("\n"));
    }
    await interaction.editReply({
      embeds: [messageCus],
    });

    client.channels.cache.get(turOf.tur_log).send({
      embeds: [
        messageCus.setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        }),
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
