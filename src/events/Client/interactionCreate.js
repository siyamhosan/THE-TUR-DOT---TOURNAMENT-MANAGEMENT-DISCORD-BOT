const {
  CommandInteraction,
  InteractionType,
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const { SearchResult, Track } = require("erela.js");
const { AggregatedSearchSuggestions } = require("../../utils/SearchAggregator");
const TheTurBOT = require("../../structures/Client");
const db = require("../../schema/storeofSMAS");


module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {TheTurBOT} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    let prefix = client.prefix;
    const ress = await db.findOne({ Guild: interaction.guildId });
    if (ress && ress.prefix) prefix = ress.prefix;

    if (interaction.type === InteractionType.ApplicationCommand) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: "This Command Is Outdated.",
          ephemeral: true,
        });

      const embed = new EmbedBuilder().setColor("Red");

      if (command.botPerms) {
        if (
          !interaction.guild.members.me.permissions.has(
            PermissionsBitField.resolve(command.botPerms || [])
          )
        ) {
          embed.setDescription(
            `I don't have **\`${
              command.botPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      if (command.userPerms) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          embed.setDescription(
            `You don't have **\`${
              command.userPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }

      const subCommand = interaction.options.getSubcommand(false);
      if (subCommand) {
        const subCommandFile = client.subCommands.get(
          `${interaction.commandName}.${subCommand}`
        );
        if (!subCommandFile)
          return interaction.reply({
            content: " This sub command is outdated.",
            ephemeral: true,
          });
        subCommandFile.run(client, interaction, prefix);
      } else {
        try {
          await command.run(client, interaction, prefix);
        } catch (error) {
          if (interaction.replied) {
            await interaction
              .editReply({
                content: `An unexcepted error occured.`,
              })
              .catch(() => {});
          } else {
            await interaction
              .reply({
                ephemeral: true,
                content: `An unexcepted error occured.`,
              })
              .catch(() => {});
          }
          console.error(error);
        }
      }
    }
  },
};
