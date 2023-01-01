// const { Message, Client, Events, EmbedBuilder } = require("discord.js");
// const turOfDB = require("../../schema/turnamentSMAS");
// let date = new Date();
// module.exports = {
//   name: Events.MessageCreate,
//   /**
//    *
//    * @param {Message} message
//    * @param {Client} client
//    */
//   run: async (client, message) => {
//     if (message.author.bot) return;
//     let turOf = await turOfDB.findOne({
//       tur_pretent: message.channel.parentId,
//     });
//     if (!turOf) return;
//     if (
//       turOf.reg_channel === message.channelId &&
//       turOf.reg_Text_Base.status
//     ){

//     } else return;
//     let errorEmbed = new EmbedBuilder()
//       .setTitle(
//         "Please Consider Doing in Correct Way! <a:tur_error:1032255870567993364>"
//       )
//       .setColor(0xff1100)
//       .setFooter({
//         text: client.user.username,
//         iconURL: client.user.displayAvatarURL(),
//       })
//       .setTimestamp();
//     if (turOf.reg_logo && message.attachments.map((x) => x.url).length !== 1) {
//       message
//         .reply({
//           embeds: [
//             errorEmbed.setDescription(
//               "Must/Only Need to upload 1 Logo `Img/Png/Jpg`"
//             ),
//           ],
//         })
//         .then(async (msg) => {
//           await new Promise((resolve) => setTimeout(resolve, 4000));
//           msg.delete();
//         });
//       await new Promise((resolve) => setTimeout(resolve, 5000));
//       return message.delete();
//     }
//     let content = message.content;
//     if (
//       content.toLowerCase().includes("team name") ||
//       content.toLowerCase().includes("teamname") ||
//       content.toLowerCase().includes("squad name") ||
//       content.toLowerCase().includes("squadname")
//     ) {
//     } else {
//       message
//         .reply({ embeds: [errorEmbed.setDescription("Must Follow Tamplate")] })
//         .then(async (msg) => {
//           await new Promise((resolve) => setTimeout(resolve, 4000));
//           msg.delete();
//         });
//       await new Promise((resolve) => setTimeout(resolve, 5000));

//       return message.delete();
//     }
//     var properties = content.split(/,?\s?\n/gim);
//     var obj = {};
//     properties.forEach(function (property) {
//       switch (property) {
//         case ":":
//           {
//             var tup = property.split(":");
//             if (
//               /team name/i.test(tup[0]) ||
//               /teamname/i.test(tup[0]) ||
//               /squad name/i.test(tup[0]) ||
//               /squadname/i.test(tup[0])
//             ) {
//               obj.name = tup[1].toUpperCase().trim();
//             }
//           }
//           break;
//         case ":-":
//           {
//             var tup = property.split(":-");
//             if (
//               /team name/i.test(tup[0]) ||
//               /teamname/i.test(tup[0]) ||
//               /squad name/i.test(tup[0]) ||
//               /squadname/i.test(tup[0])
//             ) {
//               obj.name = tup[1].toUpperCase().trim();
//             }
//           }
//           break;
//         case "-":
//           {
//             var tup = property.split("-");
//             if (
//               /team name/i.test(tup[0]) ||
//               /teamname/i.test(tup[0]) ||
//               /squad name/i.test(tup[0]) ||
//               /squadname/i.test(tup[0])
//             ) {
//               obj.name = tup[1].toUpperCase().trim();
//             }
//           }

//           break;
//       }
//     });

//     if (turOf.reg_list.map((x) => x.name).includes(obj.name.toUpperCase())) {
//       message
//         .reply({ content: "Someone already used this name to register" })
//         .then(async (msg) => {
//           await new Promise((resolve) => setTimeout(resolve, 4000));
//           msg.delete();
//         });
//       return message.delete();
//     }
//     let teamName = obj.name.toUpperCase();
//     let data = {
//       name: `${teamName}`,
//       list: `${content}`,
//       logo: `${message.attachments.map((x) => x.proxyURL)[0] ?? null}`,
//       user: `${message.author.id}`,
//       time:
//         date.toLocaleTimeString("en-US", { hour: "2-digit" }) +
//         ":" +
//         date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
//         ":" +
//         date.toLocaleTimeString("en-US", { second: "2-digit" }) +
//         "/" +
//         date.toLocaleDateString("en-US", { day: "numeric" }) +
//         "/" +
//         date.toLocaleDateString("en-US", { month: "long" }),
//     };
//     turOf.reg_list = turOf.reg_list.concat([data]);
//     turOf.save();
//     let successEmbed = new EmbedBuilder()
//       .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
//       .setDescription("Successfully Verified.")
//       .setImage(data.logo)
//       .addFields({
//         name: "Team Information",
//         value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:** ${obj.name.toUpperCase()}\n<a:animated_arrow:1024306395740385351> **USER: <@${
//           data.user
//         }>**`,
//       })
//       .setColor(0x08ff47)
//       .setFooter({
//         text: client.user.username,
//         iconURL: client.user.displayAvatarURL(),
//       })
//       .setTimestamp();
//     await client.channels.cache.get("1036669222803226665").send({
//       embeds: [successEmbed],
//     });
//     successEmbed.addFields({
//       name: "Full Message",
//       value: `\`\`\`js\n${message.content}\`\`\``,
//     });

//     await client.channels.cache.get(turOf.tur_log).send({
//       embeds: [successEmbed],
//     });
//     await message.react("1036710259265372171");
//     await message.member.roles.add("1036705378630651974");
//   },
// };
