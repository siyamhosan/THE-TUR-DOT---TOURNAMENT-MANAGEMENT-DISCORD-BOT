module.exports = async function (client) {
    const { loadFiles } = require("./fileloder");
    await client.events.clear();
    
    const Files = await loadFiles("events");
    let count = 0;
  
    Files.forEach((file) => {
      const event = require(file);
  
      const run = (...args) => event.run(client, ...args);
      client.events.set(event.name, run);
  
      if (event.rest) {
        if (event.once) client.rest.once(event.name, run);
        else client.rest.on(event.name, run);
      } else {
        if (event.once) client.once(event.name, run);
        else client.on(event.name, run);
      }
      count++
    //   client.logger.log(`${count} ---- ${event.name} ?? ${file}`, "event")
    });
  
    return client.logger.log(`Client Events Loaded ${count}`, "event");
  }
// const { readdirSync } = require('fs');

// module.exports = (client) => {
//     let count = 0;
//     readdirSync("./src/events/Client/").forEach(file => {
//         const event = require(`../events/Client/${file}`);
//         client.on(event.name, (...args) => event.run(client, ...args));
//         count++;
//     });
//     client.logger.log(`Client Events Loaded ${count}`, "event");
// }