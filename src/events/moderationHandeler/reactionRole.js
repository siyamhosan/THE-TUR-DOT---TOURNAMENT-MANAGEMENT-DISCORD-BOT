const { Events, Client, MessageReaction, UserManager, SelectMenuInteraction } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {Client} client 
     * @param {SelectMenuInteraction} interaction 
     */

    run: async (client,interaction)=>{
        const rcroels = [
            {
            name: "announcement_role",
            role:"1047495036662730752"
        },
            {
            name:"status_role",
            role:"1048269882829066350"
        },
            {
            name:"update_role",
            role:"1047495028685164544"
        },
            {
            name:"tourCT",
            role:"1048121081908699198"
        },
            {
            name:"musicCT",
            role:"1047494973710409820"
        },
            {
            name:"man",
            role:"1048122239922491402"
        },
            {
            name:"woman",
            role:"1048122346923380737"
        },
            {
            name:"custom",
            role:"1048122350232670288"
        },
    ]
    if(!interaction.isSelectMenu) return
    const {member} = interaction
    function roleGive(values){
        let role = rcroels.find(x=>x.name===values).role
        if(!member.roles.cache.has("1047494988289802253"))member.roles.add("1047494988289802253")
        if(!member.roles.cache.has("1047495063632105542"))member.roles.add("1047495063632105542")
        if(!member.roles.cache.has("1048122143608672336"))member.roles.add("1048122143608672336")
        if(member.roles.cache.has(role)){
            member.roles.remove(role)
            return false
        } else {
            member.roles.add(role)
            return true
        }
    }
    if(interaction.customId === "tursupportRolePing" || interaction.customId === "tursupportRoleCategory" || interaction.customId === "tursupportRoleGender"){
       let valus = interaction.values[0]
        if(rcroels.map(x=>x.name).includes(valus)){
            const roleaddre = roleGive(valus)
          if(roleaddre){
              return interaction.reply({content: "Role has been assigned", ephemeral: true})
          } else {
              return interaction.reply({content: "Role has been removed", ephemeral: true})

          }
        }

    }
    }
}