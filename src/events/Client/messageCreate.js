const {
  EmbedBuilder,
  Message,
  Client,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder
} = require("discord.js");
const db = require("../../schema/storeofSMAS");
const { botMention } = require("../../helpers/embedMessages");

module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot) return;

    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: message.guildId });
    if (ress && ress.prefix) prefix = ress.prefix;
    

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
      let row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=990571985048317953&permissions=8&scope=bot%20applications.commands"
          )
          .setLabel("Invite Me"),
        new ButtonBuilder()
          .setURL("https://www.facebook.com/Sahoab.Hosan")
          .setLabel("Get help")
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setURL("https://thetur.xyz/pages/commands.html")
          .setStyle(ButtonStyle.Link)
          .setLabel("Command List"),
      ]);
      message.channel.send({ embeds: [botMention], components:[row] });
    }
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("SendMessages")
      )
    )
      return await message.author.dmChannel
        .send({
          content: `I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("ViewChannel")
      )
    )
      return;

    if (
      !message.guild.members.me.permissions.has(
        PermissionsBitField.resolve("EmbedLinks")
      )
    )
      return await message.channel
        .send({
          content: `I don't have **\`EMBED_LINKS\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`,
        })
        .catch(() => {});

    const embed = new EmbedBuilder().setColor("Red");

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
      }

      embed.setDescription(reply);
      return message.channel.send({ embeds: [embed] });
    }

    if (command.botPerms) {
      if (
        !message.guild.members.me.permissions.has(
          PermissionsBitField.resolve(command.botPerms || [])
        )
      ) {
        embed.setDescription(
          `I don't have **\`${command.botPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`
        );
        return message.channel.send({ embeds: [embed] });
      }
    }
    if (command.userPerms) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.userPerms || [])
        )
      ) {
        embed.setDescription(
          `You don't have **\`${command.userPerms}\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.`
        );
        return message.channel.send({ embeds: [embed] });
      }
    }

    if (command.owner && message.author.id !== `${client.owner}`) {
      embed.setDescription(`Only <@${client.owner}> Can Use this Command`);
      return message.channel.send({ embeds: [embed] });
    }

    try {
      command.execute(message, args, client, prefix);
    } catch (error) {
      console.log(error);
      embed.setDescription(
        "There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately."
      );
      return message.channel.send({ embeds: [embed] });
    }
  },
};
