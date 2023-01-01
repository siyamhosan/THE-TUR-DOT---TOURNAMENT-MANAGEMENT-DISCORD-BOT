// const { readdirSync } = require("fs");
// const { PermissionsBitField, Routes } = require("discord.js");
// const { REST } = require("@discordjs/rest");

// module.exports = (client) => {
//   let commandArray = [];

//   let count = 0;
//   readdirSync("./src/slashCommands/").forEach((dir) => {
//     const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter(
//       (files) => files.endsWith(".js")
//     );

//     for (const file of slashCommandFile) {
//       const command = require(`../slashCommands/${dir}/${file}`);

//       if (command.subCommand)
//         return client.subCommands.set(command.subCommand, command);

//       if (!command.data.name)
//         return console.error(
//           `slashCommandNameError: ${command} application command name is required.`
//         );

//       if (!command.data.description)
//         return console.error(
//           `slashCommandDescriptionError: ${command} application command description is required.`
//         );

//       client.commands.set(command.data.name, command);

//       commandArray.push(command.data.toJSON());

//       count++;
//     }
//   });
//   // console.log(commandArray.map((x) => x.name));
//   // client.application.commands.set(commandArray);
//   client.logger.log(`Client SlashCommands Command (/) Loaded: ${count}`, "cmd");
//   const rest = new REST({ version: "10" }).setToken(client.config.token);
//   (async () => {
//     try {
//       client.logger.log("Started refreshing application (/) commands.", "cmd");
//       await rest.put(Routes.applicationCommands(client.config.clientID), {
//         body: commandArray,
//       });
//       client.logger.log(
//         "Successfully reloaded application (/) commands.",
//         "cmd"
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   })();
// };
// const { readdirSync } = require("fs");
// const { PermissionsBitField, Routes } = require("discord.js");
// const { REST } = require("@discordjs/rest");

// module.exports = (client) => {
//   const data = [];
//   let count = 0;
//   readdirSync("./src/slashCommands/").forEach((dir) => {
//     const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter(
//       (files) => files.endsWith(".js")
//     );

//     for (const file of slashCommandFile) {
//       const slashCommand = require(`../slashCommands/${dir}/${file}`);

//       if (!slashCommand.name)
//         return console.error(
//           `slashCommandNameError: ${
//             slashCommand.split(".")[0]
//           } application command name is required.`
//         );

//       if (!slashCommand.description)
//         return console.error(
//           `slashCommandDescriptionError: ${
//             slashCommand.split(".")[0]
//           } application command description is required.`
//         );

//       client.slashCommands.set(slashCommand.name, slashCommand);

//       data.push({
//         name: slashCommand.name,
//         description: slashCommand.description,
//         type: slashCommand.type,
//         options: slashCommand.options ? slashCommand.options : null,
//         default_member_permissions: slashCommand.default_member_permissions
//           ? PermissionsBitField.resolve(
//               slashCommand.default_member_permissions
//             ).toString()
//           : null,
//       });
//       count++;
//     }
//   });
//   client.logger.log(`Client SlashCommands Command (/) Loaded: ${count}`, "cmd");
//   const rest = new REST({ version: "10" }).setToken(client.config.token);
//   (async () => {
//     try {
//       client.logger.log("Started refreshing application (/) commands.", "cmd");
//       await rest.put(Routes.applicationCommands(client.config.clientID), {
//         body: data,
//       });
//       client.logger.log(
//         "Successfully reloaded application (/) commands.",
//         "cmd"
//       );
//     } catch (error) {
//       console.error(error);
//     }
//   })();
// };
const { readdirSync } = require("fs");
const { PermissionsBitField, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { loadFiles } = require("./fileloder");

module.exports = async function (client) {
  const data = [];
  let count = 0;
  let files = await loadFiles("slashCommands");

  files.forEach((file) => {
    const slashCommand = require(file);

    if (slashCommand.subCommand)
      return client.subCommands.set(slashCommand.subCommand, slashCommand);

    if (!slashCommand.data.name)
      return console.error(
        `slashCommandNameError: ${
          slashCommand.split(".")[0]
        } application command name is required.`
      );

    if (!slashCommand.data.description)
      return console.error(
        `slashCommandDescriptionError: ${
          slashCommand.split(".")[0]
        } application command description is required.`
      );

    client.slashCommands.set(slashCommand.data.name, slashCommand);

    data.push(slashCommand.data);
    count++;
  });
  client.logger.log(`Client SlashCommands Command (/) Loaded: ${count}`, "cmd");
  const rest = new REST({ version: "10" }).setToken(client.config.token);
  (async () => {
    try {
      client.logger.log("Started refreshing application (/) commands.", "cmd");
      await rest.put(Routes.applicationCommands(client.config.clientID), {
        body: data,
      });
      client.logger.log(
        "Successfully reloaded application (/) commands.",
        "cmd"
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
