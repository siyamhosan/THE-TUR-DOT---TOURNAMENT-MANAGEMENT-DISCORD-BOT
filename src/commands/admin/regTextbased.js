const {
  Client,
  EmbedBuilder,
  PermissionFlagsBits,
  Message,
} = require("discord.js");
const {
  wrongChannel,
  notAdminMessage,
} = require("../../helpers/embedMessages");

module.exports = {
  name: "textreg",
  aliases: ["textregistration"],
  category: "Registration",
  description: "Start registration by text with requirements",
  args: false,
  usage: "",
  owner: false,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  execute: async (message, args, client, prefix) => {
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: message.channel.parentId,
    });
    if (!turOf) {
      return message.reply({
        ephemeral: true,
        embeds: [wrongChannel],
      });
    }
    if (
      message.member.permissions.has(PermissionFlagsBits.Administrator) ||
      message.member.roles.cache.has(turOf.tur_mod)
    ) {
    } else {
      return message.reply({
        embeds: [notAdminMessage],
      });
    }
    if (turOf.reg_Text_Base.status) {
      turOf.reg_Text_Base.status = false;
      turOf.save();
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Text Based Registration!")
            .setDescription(
              "Text based registration truned off <:toggle_off:1045767014452564100> "
            )
            .setColor(client.successColor)
            .addFields({
              name: "**NOTE**",
              value:
                "Text Based Registration Requirements Are Still Here! Not Reseted.",
            })
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
      });
    }
    const embed = new EmbedBuilder()
      .setTitle(`Text Based Registration!`)
      .setDescription(
        `Please provide the requirements you want for registration! \nAs default \`Team Name\` is available\nAdditional requirements we have \`\`\`\n[ list, logo ]\`\`\`\nJust type the requirement you want!\n\n\n**Left this as it is if you want just team name**\nThis Message Will Delete In 15s`
      )
      .setColor(client.successColor)
      .setTimestamp()
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      });

    let counter = 0;
    const filter = (m) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1,
    });
    message.reply({ embeds: [embed] }).then(async (msg) => {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 15));
      msg.delete();
    });
    collector.on("collect", (m) => {
      if (counter < 1) {
        if (
          m.content.toLowerCase() === "list" ||
          m.content.toLowerCase() === "logo"
        ) {
        } else
          return m.channel
            .send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Text Based Registration! Failed!")
                  .setColor(client.wrongColor)
                  .setDescription(
                    `Unfortunately we only have those requirements at this time... \`\`\`\n[ list, logo ]\`\`\``
                  ),
              ],
            })
            .then(async (msg) => {
              await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
              msg.delete();
            });
      }
      turOf.reg_Text_Base.status = true;
      turOf.save();
      m.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Text Based Registration! Failed!")
            .setColor(client.wrongColor)
            .setDescription(
              `Unfortunately we only have those requirements at this time... \`\`\`\n[ list, logo ]\`\`\` \nJust type the requirement you want!\n\n\n**Left this as it is if you want just team name**`
            ),
        ],
      })
      .then(async (msg) => {
        await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
        msg.delete();
      });
    });

    collector.on("end", (collected) => {
      if(collected){
        turOf.reg_Text_Base.requirements.push(
          collected
            .map((x) => x.content)
            .toString()
            .split(",")
        );
      }
      let tempString = [`Team Name : `];
      if (turOf.reg_Text_Base.requirements.includes("list"))
        tempString.push(`Team List : `);
      let succTemplate = new EmbedBuilder()
        .setTitle("Text Based Registration! <a:tur_blt:1034733773817909308> ")
        .setDescription(
          "Text based registration truned on <:tur_enable:1024308676179275836>  "
        )
        .setColor(client.successColor)
        .addFields(
          {
            name: "Requirements selected",
            value: `Team name, ${turOf.reg_Text_Base.requirements.join(", ")?? ""}`,
          },
          {
            name: "Template according your requirement",
            value: `${tempString.join("\n")}`,
          }
        )
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      turOf.reg_Text_Base.status = true;
      turOf.reg_Text_Base.template = tempString.join("\n");
      turOf.save();
      message.channel.send({ embeds: [succTemplate] });
    });
  },
};
