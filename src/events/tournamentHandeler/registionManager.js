const { Client, Message ,EmbedBuilder} = require("discord.js");
const turOfDB = require("../../schema/turnamentSMAS")

module.exports = {
    name: "messageCreate",
    
        /**
         * 
         * @param {Client} client 
         * @param {Message} message 
         */
    run: async(client, message)=>{
        let turOf = await turOfDB.findOne({reg_channel: message.channelId})
        if(!turOf) return
        if(!turOf.reg_Text_Base.status) return

        let errorEmbed = new EmbedBuilder()
        .setTitle(
          "Opps! <a:tur_error:1032255870567993364>"
        )
        .setColor(client.wrongColor)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();
    
      if (turOf.reg_Text_Base.requirements.includes("logo") && message.attachments.map((x) => x.url).length !== 1) {
        message
          .reply({
            embeds: [
              errorEmbed.setDescription(
                "Must/Only Need to upload 1 Logo `Img/Png/Jpg` \n\n\n\n**This Message Will Delete In 4s**"
              ),
            ],
          })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            msg.delete();
          });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return message.delete();
      }
      let content = message.content;
      if (
        content.includes(":") ||
        content.includes(":-") ||
        content.includes("-") ||
        content.toLowerCase().includes("team name") ||
        content.toLowerCase().includes("teamname") ||
        content.toLowerCase().includes("squad name") ||
        content.toLowerCase().includes("squadname")
      ) {
      } else {
        message
          .reply({ embeds: [errorEmbed.setDescription("Must Follow Tamplate")] })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            msg.delete();
          });
        await new Promise((resolve) => setTimeout(resolve, 5000));
  
        return message.delete();
      }
      
      var properties = content.split(/,?\n/gim);
      var obj = {};
      properties.forEach(function (property) {

        if(properties.includes(":")){
            var tup = property.split(":");
            if (
              /team name/i.test(tup[0]) ||
              /teamname/i.test(tup[0]) ||
              /squadname/i.test(tup[0]) ||
              /squad name/i.test(tup[0])
            ) {
              obj.name = tup[1].toUpperCase().trim();
            }

        } else if(properties.includes(":-")){
            var tup = property.split(":-");
            if (
              /team name/i.test(tup[0]) ||
              /teamname/i.test(tup[0]) ||
              /squadname/i.test(tup[0]) ||
              /squad name/i.test(tup[0])
            ) {
              obj.name = tup[1].toUpperCase().trim();
            }

        } else if(properties.includes("-")){
            var tup = property.split("-");
            if (
              /team name/i.test(tup[0]) ||
              /teamname/i.test(tup[0]) ||
              /squadname/i.test(tup[0]) ||
              /squad name/i.test(tup[0])
            ) {
              obj.name = tup[1].toUpperCase().trim();
            }

        }
      });
      if(!obj.name) return  message
      .reply({ embeds: [errorEmbed.setDescription("No team name found!\nPlease follow the template.")] })
      .then(async (msg) => {
        await new Promise((resolve) => setTimeout(resolve, 4000));
        msg.delete();
      });
   



      if (turOf.reg_list.map((x) => x.name).includes(obj.name.toUpperCase())) {
        message
          .reply({ embeds: [errorEmbed.setDescription("Someone already used this name to register on this tournament.")] })
          .then(async (msg) => {
            await new Promise((resolve) => setTimeout(resolve, 4000));
            msg.delete();
          });
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return message.delete();
      }
      let teamName = obj.name.toUpperCase();
      let data = {
        name: `${teamName}`,
        list: `${content}`,
        logo: `${message.attachments.map((x) => x.proxyURL)[0] ?? " "}`,
        user: `${message.author.id}`,
        time:
          date.toLocaleTimeString("en-US", { hour: "2-digit" }) +
          ":" +
          date.toLocaleTimeString("en-US", { minute: "2-digit" }) +
          ":" +
          date.toLocaleTimeString("en-US", { second: "2-digit" }) +
          "/" +
          date.toLocaleDateString("en-US", { day: "numeric" }) +
          "/" +
          date.toLocaleDateString("en-US", { month: "long" }),
      };
      turOf.reg_list = turOf.reg_list.concat([data]);
      turOf.save();
      let successEmbed = new EmbedBuilder()
        .setTitle("Success! <a:tur_greenCheck:1020702114198077471>")
        .setDescription("Successfully Verified.")
        .addFields({
          name: "Team Information",
          value: `<a:animated_arrow:1024306395740385351>**TEAM NAME:** ${obj.name.toUpperCase()}\n<a:animated_arrow:1024306395740385351> **USER: <@${
            data.user
          }>**`,
        })
        .setColor(0x08ff47)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();
        if(data.logo) successEmbed.setImage(data.logo)
      await message.author.send({
        embeds: [successEmbed],
      });
      successEmbed.addFields({
        name: "Full Message",
        value: `\`\`\`js\n${message.content}\`\`\``,
      });
  
      await client.channels.cache.get(turOf.tur_log).send({
        embeds: [successEmbed],
      });
      await message.react("1036710259265372171"); 








    }
}