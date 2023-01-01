const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  SlashCommandSubcommandGroupBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin Commands")
    .addSubcommandGroup((group) =>
      group
        .setName("reg")
        .setDescription("Registration management.")
        .addSubcommand((command) =>
          command
            .setName("list")
            .setDescription("get registration list")
            .addStringOption((option) =>
              option
                .setName("specific")
                .setDescription("Get specific information from list")
                .setChoices(
                  { name: "Names", value: "name" },
                  {
                    name: "Members List",
                    value: "list",
                  }
                  // {
                  //   name: "logos",
                  //   value: "logo",
                  // }
                )
            )
        )
        .addSubcommand((command) =>
          command
            .setName("link-generator")
            .setDescription("Generate Custom registration link")
        )
        .addSubcommand((command) =>
          command
            .setName("list-sheet")
            .setDescription("Get registration list in Exel Sheet")
        )
        .addSubcommand((command) =>
          command
            .setName("status")
            .setDescription("Set registration status")
            .addStringOption((option) =>
              option
                .setName("options")
                .setDescription("Registration status now")
                .setRequired(true)
                .setChoices(
                  { name: "Start", value: "stReg" },
                  {
                    name: "Ended",
                    value: "ended",
                  }
                )
            )
        )
        .addSubcommand((command) =>
          command
            .setName("limit")
            .setDescription("Set registration limit")
            .addNumberOption((option) =>
              option
                .setName("slots")
                .setDescription("Registration limit ")
                .setRequired(true)
                .setMinValue(1)
            )
        )
        .addSubcommand((command) =>
          command.setName("reset").setDescription("Reset registration")
        )
        .addSubcommand((command) =>
          command
            .setName("update")
            .setDescription("Update/change/delete any registred team")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name Of The Squad")
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("intention")
                .setRequired(true)
                .setDescription("What You want do do with this team")
                .addChoices(
                  { name: "Name (Change Team Name)", value: "name" },
                  {
                    name: "Members List (Change Team Members List)",
                    value: "list",
                  },
                  { name: "Logo (Change Team logo)", value: "logo" },
                  {
                    name: "Delete (Delete Team)",
                    value: "delete",
                  }
                )
            )
            .addStringOption((option) =>
              option
                .setName("quary")
                .setDescription("Update To...")
                .setMinLength(3)
            )
            .addAttachmentOption((option) =>
              option.setName("quary-logo").setDescription("new logo")
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("group")
        .setDescription("Group Role Commands")
        .addSubcommand((command) =>
          command
            .setName("add")
            .setDescription("Add A Group And Role")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name of the group")
                .setRequired(true)
                .setMinLength(1)
            )
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Role of the group")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("delete")
            .setDescription("Delete A Group And Role")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name of the group")
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand((command) =>
          command.setName("reset").setDescription("Reset All Group And Role")
        )
    ),
};
