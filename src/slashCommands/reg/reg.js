const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Client,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  AttachmentBuilder,
} = require("discord.js");
const { wrongChannel } = require("../../helpers/embedMessages");
const date = new Date();
module.exports = {
  data: new SlashCommandBuilder()
    .setName("reg")
    .setDescription("Tournament registration command")
    .addStringOption((options) =>
      options
        .setName("name")
        .setDescription("Name Of The Team")
        .setRequired(true)
        .setMinLength(3)
    )
    .addStringOption((options) =>
      options
        .setName("list")
        .setDescription("Member List Of The Team")
        .setRequired(true)
        .setMinLength(10)
    )
    .addAttachmentOption((option) =>
      option
        .setName("logo")
        .setDescription("Logo Of The Team")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("trxid")
        .setDescription("Payment Transaction Id")
        .setRequired(false)
    ),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
 run: async (client,interaction) => {
    await interaction.deferReply();
    let newDataToStore = {
      name: " ",
      list: " ",
      logo: null,
      user: " ",
      time: " ",
    };
    const turOfDB = require("../../schema/turnamentSMAS");
    let turOf = await turOfDB.findOne({
      tur_pretent: interaction.channel.parentId,
    });

    if (!turOf || interaction.channelId !== turOf.reg_channel) {
      return interaction
        .editReply({
          ephemeral: true,
          embeds: [wrongChannel],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          msg.delete();
        });
    }
    let noSlotMessage = new EmbedBuilder()
      .setDescription("There are no slots left. Next time, please try again")
      .setColor(0xf55427)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });
    if (turOf.reg_list.length === turOf.reg_limit) {
      interaction
        .editReply({
          ephemeral: true,
          embeds: [noSlotMessage],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          msg.delete();
        });
      turOf.reg_status = "full";
      turOf.save();
      {
        await new Promise((resolve) =>
          setTimeout(resolve, 1 * 60 * 60 * 1000)
        ).then(() => {
          turOf.reg_status = "ended";
          turOf.save;
        });
      }
      return;
    }

    if (turOf.reg_list.length === 0 && turOf.reg_status === "notSt") {
      return interaction
        .editReply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setTitle("Sorry! <a:tur_error:1032255870567993364>")
              .setDescription("Registration is not started yet!")
              .setColor(0xf55427)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          msg.delete();
        });
    } else if (turOf.reg_status === "full") {
      return interaction.editReply({
        ephemeral: true,
        embeds: [noSlotMessage],
      });
    } else if (turOf.reg_status === "ended") {
      return interaction
        .editReply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setTitle("Sorry! <a:tur_error:1032255870567993364>")
              .setDescription("Sorry! Registration has ended")
              .setColor(0xcc0000)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          msg.delete();
        });
    }
    if (
      turOf.reg_list
        .map((x) => x.name)
        .includes(interaction.options.get("name").value.toUpperCase())
    ) {
      return interaction
        .editReply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setTitle("Opps! <a:tur_error:1032255870567993364>")
              .setDescription("Some already used this name.")
              .setColor(0xf55427)
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
          ],
        })
        .then(async (msg) => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          msg.delete();
        });
    }
    let logoUrl;
    if (interaction.options.get("logo")) {
      logoUrl = interaction.options.get("logo").attachment.proxyURL;
    }
    if (turOf.reg_payment) {
      let toDeleteMsgId;
      if (!interaction.options.get("trxid")) {
        return interaction
          .editReply({
            ephemeral: true,
            embeds: [
              new EmbedBuilder()
                .setTitle("Error! <a:tur_error:1032255870567993364>")
                .setDescription(
                  "Sorry! This Is Pay Paid Tournament. You Must Payment And Provide `transaction id` In Trxid Section"
                )
                .setColor(0xcc0000)
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
          })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            msg.delete();
          });
      }
      let payConfoirmData = {
        delete_message_id: " ",
        trx_id: interaction.options.get("trxid").value.toUpperCase(),
        name: interaction.options.get("name").value.toUpperCase(),
        list: interaction.options.get("list").value.trim(),
        logo: null,
        user: interaction.user.id,
        time:
          date.toLocaleTimeString("en-US", { second: "2-digit" }) +
          ":" +
          date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
          ":" +
          date.toLocaleTimeString("en-US", { hour: "2-digit" }) +
          "/" +
          date.toLocaleDateString("en-US", { day: "numeric" }) +
          "/" +
          date.toLocaleDateString("en-US", { month: "long" }),
      };
      let waitingEmbed = new EmbedBuilder()
        .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
        .setDescription(
          "Registration on pending. **Waiting On Payment Confirmation**"
        )
        .addFields({
          name: "Team Information",
          value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
            .get("name")
            .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
            interaction.user.id
          }>**`,
        })
        .setColor(0xff6600)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();
      if (logoUrl) waitingEmbed.setImage(logoUrl);

      interaction
        .editReply({
          embeds: [waitingEmbed],
        })
        .then((msg) => {
          toDeleteMsgId = msg.id;
        });

      await new Promise((resolve) => setTimeout(resolve, 800));
      if (interaction.options.get("logo")) {
        payConfoirmData.logo =
          interaction.options.getAttachment("logo").proxyURL;
      }
      let bt1 = new ButtonBuilder()
        .setCustomId(`payConfoirm`)
        .setLabel("Confirm")
        .setEmoji("1020702114198077471")
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);
      let bt2 = new ButtonBuilder()
        .setCustomId(`payDecline`)
        .setLabel("Decline")
        .setEmoji("1017059852222218291")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(false);
      let conformRow = new ActionRowBuilder().addComponents(bt1, bt2);
      let msgSendI = interaction.guild.channels.cache.get(
        turOf.reg_payment_check
      );
      let msgSendID;
      let requistEmbed = new EmbedBuilder()
        .setTitle("Payment Request!")
        .setDescription(
          `Please Confoirm Or Decline Registition.\n<@&${turOf.tur_mod}>`
        )
        .addFields(
          {
            name: "Team Information",
            value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
              .get("name")
              .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
              interaction.user.id
            }>**\n<a:animated_arrow:1024306395740385351>**Team List:${
              interaction.options.get("list").value
            }**`,
          },
          {
            name: "Payment TRX-ID",
            value: payConfoirmData.trx_id,
          }
        )
        .setColor(0xff6600)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();
      if (logoUrl) requistEmbed.setImage(logoUrl);
      msgSendI
        .send({
          embeds: [requistEmbed],
          components: [conformRow],
        })
        .then((msg) => (msgSendID = msg.id));

      payConfoirmData.delete_message_id = toDeleteMsgId;
      let oldPayData = turOf.reg_payment_list;
      let newPayData = oldPayData.concat([payConfoirmData]);
      turOf.reg_payment_list = newPayData;
      turOf.save();
      let collector = interaction.guild.channels.cache
        .get(turOf.reg_payment_check)
        .createMessageComponentCollector({
          max: 1,
        });
      collector.on("collect", async (btnI) => {
        if (!btnI.isButton) return;
        let btnId = btnI.customId;
        if (!btnId) return;
        if (btnId === "payConfoirm") {
          let filteredPaylist = [];
          turOf.reg_payment_list.forEach((x) => {
            if (
              x.name === interaction.options.get("name").value.toUpperCase() &&
              x.trx_id === interaction.options.get("trxid").value.toUpperCase()
            )
              return;
            return filteredPaylist.push(x);
          });
          turOf.reg_payment_list = filteredPaylist;
          newDataToStore.name = interaction.options
            .get("name")
            .value.toUpperCase();
          newDataToStore.list = interaction.options.get("list").value.trim();
          if (interaction.options.get("logo")) {
            newDataToStore.logo =
              interaction.options.get("logo").attachment.proxyURL;
          }
          newDataToStore.user = interaction.user.id;
          newDataToStore.time =
            date.toLocaleTimeString("en-US", { second: "2-digit" }) +
            ":" +
            date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
            ":" +
            date.toLocaleTimeString("en-US", { hour: "2-digit" }) +
            "/" +
            date.toLocaleDateString("en-US", { day: "numeric" }) +
            "/" +
            date.toLocaleDateString("en-US", { month: "long" });
          turOf.reg_list = turOf.reg_list.concat([newDataToStore]);
          turOf.save();
          let successEmbed = new EmbedBuilder()
            .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
            .setDescription("Successfully registered.")
            .addFields({
              name: "Team Information",
              value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
                .get("name")
                .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
                interaction.user.id
              }>**\n<a:animated_arrow:1024306395740385351>**Slot Left: ${
                turOf.reg_limit - turOf.reg_list.length
              }**`,
            })
            .setColor(0xff6600)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          if (logoUrl) successEmbed.setImage(logoUrl);
          interaction.editReply({
            embeds: [successEmbed],
          });
          interaction.user.send({
            embeds: [successEmbed],
          });
          await client.channels.cache.get(turOf.tur_log).send({
            embeds: [
              successEmbed.setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
            ],
          });
        } else if (btnI.customId === "payDecline") {
          let filteredPaylist = [];
          turOf.reg_payment_list.forEach((x) => {
            if (
              x.name === interaction.options.get("name").value.toUpperCase() &&
              x.trx_id === interaction.options.get("trxid").value.toUpperCase()
            )
              return;
            return filteredPaylist.push(x);
          });
          turOf.reg_payment_list = filteredPaylist;
          turOf.save();
          let declineEmbed = new EmbedBuilder()
            .setTitle("Sorry! <a:tur_redCheck:1017059852222218291>")
            .setDescription("**Registration Declined**")
            .addFields({
              name: "Team Information",
              value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
                .get("name")
                .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
                interaction.user.id
              }>**`,
            })
            .setColor(0xff6600)
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();
          if (logoUrl) declineEmbed.setImage(logoUrl);
          interaction.editReply({
            embeds: [declineEmbed],
          });
          interaction.user.send({
            embeds: [declineEmbed],
          });
          await client.channels.cache.get(turOf.tur_log).send({
            embeds: [
              declineEmbed.setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              }),
            ],
          });
        }
      });
      collector.on("end", async (Collection) => {
        Collection.forEach(async (cci) => {
          if (cci.customId === "payConfoirm") {
            await msgSendI.messages.cache.get(msgSendID).delete();
            let confoirmEmbed = new EmbedBuilder()
              .setTitle("Pay Confirmed! <a:tur_greenCheck:1020702114198077471>")
              .setDescription("Successfully Registered This Team.")
              .addFields(
                {
                  name: "Team Information",
                  value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
                    .get("name")
                    .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
                    interaction.user.id
                  }>**\n<a:animated_arrow:1024306395740385351>**Slot Left: ${
                    turOf.reg_limit - turOf.reg_list.length
                  }**\n<a:animated_arrow:1024306395740385351>**Team List:${
                    interaction.options.get("list").value
                  }**`,
                },
                {
                  name: "**Pay confirmed by: **",
                  value: `<@${cci.user.id}>`,
                }
              )
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setColor(0xff6600)
              .setTimestamp();
            if (logoUrl) confoirmEmbed.setImage(logoUrl);
            await msgSendI.send({
              embeds: [confoirmEmbed],
            });
            await client.channels.cache.get(turOf.tur_log).send({
              embeds: [confoirmEmbed],
            });
          } else if (cci.customId === "payDecline") {
            await msgSendI.messages.cache.get(msgSendID).delete();
            let confoirmEmbed = new EmbedBuilder()
              .setTitle("Pay Declined! <a:tur_redCheck:1017059852222218291>")
              .setDescription("Successfully Registered This Team.")
              .addFields(
                {
                  name: "Team Information",
                  value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
                    .get("name")
                    .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
                    interaction.user.id
                  }>**\n<a:animated_arrow:1024306395740385351>**Team List:${
                    interaction.options.get("list").value
                  }**`,
                },
                {
                  name: "**Pay Declined by: **",
                  value: `<@${cci.user.id}>`,
                }
              )
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
              })
              .setColor(0xff6600)
              .setTimestamp();
            if (logoUrl) confoirmEmbed.setImage(logoUrl);
            await msgSendI.send({
              embeds: [confoirmEmbed],
            });
            await client.channels.cache.get(turOf.tur_log).send({
              embeds: [confoirmEmbed],
            });
          }
        });
      });

      return;
    }

    newDataToStore.name = interaction.options.get("name").value.toUpperCase();
    newDataToStore.list = interaction.options.get("list").value.trim();
    if (interaction.options.get("logo")) {
      newDataToStore.logo = interaction.options.get("logo").attachment.proxyURL;
    }
    newDataToStore.user = interaction.user.id;
    newDataToStore.time =
      date.toLocaleTimeString("en-US", { hour: "2-digit" }) +
      ":" +
      date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
      ":" +
      date.toLocaleTimeString("en-US", { second: "2-digit" }) +
      "/" +
      date.toLocaleDateString("en-US", { day: "numeric" }) +
      "/" +
      date.toLocaleDateString("en-US", { month: "long" });
    turOf.reg_list = turOf.reg_list.concat([newDataToStore]);
    turOf.save();
    let SuccessfullyEMbed = new EmbedBuilder()
      .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
      .setDescription("Successfully registered.")
      .addFields({
        name: "Team Information",
        value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:${interaction.options
          .get("name")
          .value.toUpperCase()}**\n<a:animated_arrow:1024306395740385351> **Registration By: <@${
          interaction.user.id
        }>**\n**Team List:${
          interaction.options.get("list").value
        }**\n<a:animated_arrow:1024306395740385351>**Slot Left: ${
          turOf.reg_limit - turOf.reg_list.length
        }**`,
      })
      .setColor(0xff6600)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    if (logoUrl) SuccessfullyEMbed.setImage(logoUrl);
    await interaction.editReply({
      embeds: [SuccessfullyEMbed],
    });
    await client.channels.cache.get(turOf.tur_log).send({
      embeds: [SuccessfullyEMbed],
    });
  },
};
