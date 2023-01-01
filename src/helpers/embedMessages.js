const { EmbedBuilder } = require("discord.js");
const client = require("../index");
module.exports = {
  notAdminMessage: new EmbedBuilder()
    .setTitle("You Dont Have `ADMINISTRATOR` Permission")
    .setDescription(
      "Must have tour mod role or ADMINISTRATOR permission to use this command"
    )
    .setColor(0xf55427)
    .setFooter({
      text: "The Tur Dot",
      // iconURL: `${client.user.displayAvatarURL()}`,
    })
    .setTimestamp(),
  wrongChannel: new EmbedBuilder()
    .setTitle("Wrong Channel!")
    .setDescription(
      "This Command Suppose to be used in a tur manage channel. please consider using this command in manage channel"
    )
    .setColor(0xf55427)
    .setFooter({
      text: "THE TUR DOT",
      // iconURL: client.user.displayAvatarURL(),
    }),
  botMention: new EmbedBuilder()
    .setDescription(
      `Hey there!\nYou can use Me for managing Esports Tournament\ntype \`ig?help\` to get all commands\nCommands list at https://thetur.xyz/pages/commands.html\nAny Help Need? https://fb.com/Sahoab.Hosan`
    )
    .setFooter({
      text: `thetur.xyz`,
      // iconURL: client.user.displayAvatarURL(),
    })
    .setColor(0x22f7d2),
  botMentionInvite: new EmbedBuilder()
    .setDescription(
      "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=990571985048317953&permissions=8&scope=bot%20applications.commands)\n\n Invite From:" +
        process.env.DOMAIN +
        "invite"
    )
    .setFooter({
      text: `thetur.xyz`,
      // iconURL: client.user.displayAvatarURL(),
    })
    .setColor(0x22f7d2),
  botMaintionHelp: new EmbedBuilder({
    description:
      "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=990571985048317953&permissions=8&scope=bot%20applications.commands) **|** [Get Help](https://fb.me/Sahoab.Hosan)\n\n<:icon_note:1035025429708414976> help information\n> <:Prefix:1037228991670665297> This is for Prefix Commands [default prefix `ig?`] example - `ig?set log`\n\n> <:slash_cmd:1023859798736912405> This is Slash Commands. Type `/` to see\n\n<a:tur_ra:1024316087938076712> **Setup's**\n<:Prefix:1037228991670665297>`set log , set prefix {new prefix}`\n\n<a:tur_ra:1024316087938076712> **Tournament**\n<:slash_cmd:1023859798736912405></tour create:0> , </tour delete:0>\n\n<a:tur_ra:1024316087938076712> **Registration**\n<:slash_cmd:1023859798736912405></admin reg status:0> , </admin reg limit:0> , </admin reg list:0> , </admin reg update:0> , </admin reg reset:0> , </admin reg link-generate:0> , </admin reg list-sheet:0> \n\n<:Prefix:1037228991670665297>`streg , endreg`\n\n<a:tur_ra:1024316087938076712> **Group Role**\n<:slash_cmd:1023859798736912405> </admin group add:0> , </admin group delete:0> , </admin group reset:0> \n\n<a:tur_ra:1024316087938076712> **Results/Benner**\n<:slash_cmd:1023859798736912405> </result add:0> , </result update:0> , </result info:0> , </result benner-customize:0> , </result getbenner:0> , </result reset:0> \n\n<:Prefix:1037228991670665297>`resultadd {results string}`\n\n<a:tur_ra:1024316087938076712> **Payment Methods**\n<:slash_cmd:1023859798736912405> </pay add:0> , </pay info:0> , </pay remove:0> , </pay reset:0> \n\n<a:tur_ra:1024316087938076712> **Sticky/Pin Message**\n<:slash_cmd:1023859798736912405> </sticky create:0> , </sticky list:0> , </sticky delete:0> \n\n<a:tur_ra:1024316087938076712> **Additional Information**\nTo get `get role` button create a Sticky message <:slash_cmd:1023859798736912405> </sticky create:0> on #`get-role` channel.\n\nAll Command And Information [thetur.xyz/commands](https://thetur.xyz/pages/commands.html)",
  })
    .setFooter({
      text: `thetur.xyz`,
      // iconURL: client.user.displayAvatarURL(),
    })
    .setColor(0x22f7d2),
  schedeulerWork: async function (turOf) {
    return new EmbedBuilder()
      .setTitle(
        "<a:tur_right_arrow:1016656565375340584> **Successfully Started Registration** <a:tur_done:1015661729109254164> "
      )
      .setDescription("**By Scheduler** <:tur_clock:1017041521008201798>")
      .addFields({
        name: "Total Slots:",
        value: `${turOf.reg_limit} (Left ${
          turOf.reg_list - turOf.reg_list.length
        })`,
      })
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(0x2ef297)
      .setTimestamp();
  },
};
