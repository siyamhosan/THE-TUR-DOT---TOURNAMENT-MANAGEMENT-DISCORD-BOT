const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require("util");
const chalk = require("chalk");
const webhook = new WebhookClient({
  url: "https://discord.com/api/webhooks/1033096845964083331/zEhX9UCrlH4o1FkFvl6zEX136flpFyG3FOYoCZ25tji35daXUxdofBLHC6DU-1FPUkAe",
});

module.exports = (client) => {
  const embed = new EmbedBuilder().setColor("Red");

  client.on("error", (err) => {
    console.log(
      chalk.blue("[Carsh Handeler] | [Error] | [Start] : ~~~~~~~~~~")
    );
    console.log(err);
    console.log(chalk.blue("[Carsh Handeler] | [Error] | [End] : ~~~~~~~~~~"));
    embed
      .setTitle("Discord API Error")
      .setURL("https://discordjs.guide/popular-topics/errors.html#api-errors")
      .setDescription(
        `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.log(
      chalk.blue(
        "[Carsh Handeler] | [unhandledRejection] | [Start] : ~~~~~~~~~~"
      )
    );
    console.log(reason, "\n", promise);
    console.log(
      chalk.blue("[Carsh Handeler] | [unhandledRejection] | [End] : ~~~~~~~~~~")
    );

    embed
      .setTitle("Unhandled Rejection/Catch")
      .setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
      .addFields(
        {
          name: "Reason",
          value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Promise",
          value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtException", (err, origin) => {
    console.log(
      chalk.blue(
        "[Carsh Handeler] | [uncaughtException] | [Start] : ~~~~~~~~~~"
      )
    );
    console.log(err, "\n", origin);
    console.log(
      chalk.blue("[Carsh Handeler] | [uncaughtException] | [End] : ~~~~~~~~~~")
    );

    embed
      .setTitle("Uncaught Exception/Catch")
      .setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(
      chalk.blue(
        "[Carsh Handeler] | [uncaughtExceptionMonitor] | [Start] : ~~~~~~~~~~"
      )
    );
    console.log(err, "\n", origin);
    console.log(
      chalk.blue(
        "[Carsh Handeler] | [uncaughtExceptionMonitor] | [End] : ~~~~~~~~~~"
      )
    );

    embed
      .setTitle("Uncaught Exception Monitor")
      .setURL(
        "https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor"
      )
      .addFields(
        {
          name: "Error",
          value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``,
        },
        {
          name: "Origin",
          value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``,
        }
      )
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });

  process.on("warning", (warn) => {
    console.log(
      chalk.blue("[Carsh Handeler] | [warning] | [Start] : ~~~~~~~~~~")
    );
    console.log(warn);
    console.log(
      chalk.blue("[Carsh Handeler] | [warning] | [End] : ~~~~~~~~~~")
    );

    embed
      .setTitle("Uncaught Exception Monitor Warning")
      .setURL("https://nodejs.org/api/process.html#event-warning")
      .addFields({
        name: "Warning",
        value: `\`\`\`${inspect(warn, { depth: 0 }).slice(0, 1000)}\`\`\``,
      })
      .setTimestamp();

    return webhook.send({ embeds: [embed] });
  });
  client.logger.log(chalk.blue(`Loaded ErrorHandler (AntiCrash)`));
};
