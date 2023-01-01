const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, Message, Client } = require("discord.js");

module.exports = {
    name: "kirerrckoi?",
    category: "Custom",
    aliases: [],
    description: "reaction Role message to tur support server",
    args: false,
    usage: "",
    userPerms: [PermissionFlagsBits.SendMessages],
    owner: true,
    /**
     * 
     * @param {Message} message 
     * @param {String[]} args 
     * @param {Client} client 
     * @param {String} prefix 
     */
    execute: async (message, args, client, prefix)=> {
        const pingRow = new ActionRowBuilder()
      .addComponents(
          new SelectMenuBuilder()
              .setCustomId('tursupportRolePing')
              .setPlaceholder('Select your ping roles')
              .addOptions(
                  {
                      label: 'Announcement Ping',
                      description: 'You will receive notifications whenever there is a new announcement for server',
                      value: 'announcement_role',
                  },
                  {
                      label: 'Status Ping',
                      description: 'You will be notified of any Bot status , maintenance , downtime',
                      value: 'status_role',
                  },
                  {
                      label: 'Updates Ping',
                      description: 'You will be notified of any updates about the bot, new feature etc',
                      value: 'update_role',
                  },
              )
      );
      const ctRow = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
        .setCustomId('tursupportRoleCategory')
        .setPlaceholder('Select Category of bot use')
        .addOptions(
            {
                label: 'Tournament Category',
                description: 'Bot use cases for tournaments',
                value: 'tourCT',
            },
            {
                label: 'Music Category',
                description: 'Bot use cases for music',
                value: 'musicCT',
            },
        ),
   
      );
      const genderRow = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
        .setCustomId('tursupportRoleGender')
        .setPlaceholder('Select your gender roles')
        .addOptions(
            {
                label: 'Man',
                description: 'He/Him',
                value: 'man',
            },
            {
                label: 'Woman',
                description: 'She/Her',
                value: 'woman',
            },
            {
                label: 'Custom',
                description: 'He/Her',
                value: 'custom',
            },
        ),
      );
      let message1 = new EmbedBuilder({
        title: "*Hello adventurer , welcome to the self role .*",
        description: "You get the role you need by yourself. <:notify:1048509367638560839>\n\n        *   ROLE INTRODUCTION :  *      \n\nSection role :",
        color: client.successColor
        
      })
      let message2 = new EmbedBuilder({
        title: "❓ What are you using this bot for ?",
        description: "(You can select both)\n<a:tournament:1048507303797719091> <@&1048121081908699198> \n<a:music:1046778609660067870> <@&1047494973710409820>",
        color: client.successColor
      })
      let message3 = new EmbedBuilder({
        title: "   What is your gender ?",
        description: "<:FeelsMandoMan:1048511970879471698> <@&1048122239922491402>\n<a:womanshrugging:1048511579609649192> <@&1048122346923380737>",
        color: client.successColor
      })
     
      let message4 = new EmbedBuilder({
        title: "<:notify:1048509367638560839> **Notification roles :** ",
        description: "```What kind of notifications do you want to receive?```\n(You can get both of them)\n<:serverstats:1043144984179785788> <@&1047495028685164544>  (Updates about the bot , new feature and stuff)\n<:database:1043145683944886352> <@&1048269882829066350> (Bot status , maintenance , downtime)\n<:m_announce:1048510456228216833> <@&1047495036662730752> (Server updates)",
        color: client.successColor
      })
    let channel = await  client.channels.fetch("1047500459046346872")
    channel.send({embeds: [message1]})
    channel.send({embeds: [message2], components:[ctRow]})
    channel.send({embeds: [message3], components:[genderRow]})
    channel.send({embeds: [message4], components:[pingRow]})


    }


}