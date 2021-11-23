const asciiTable = require('ascii-table');
const discord = require("discord.js");

module.exports = {
    name: "ready",
    once: true,
    async execute() {
        const client = global.client;
        const table = new asciiTable('Discord Ready Event');
        //build table of bot info
        table.addRow('Client', client.user.tag);
        table.addRow('Name', client.user.username);
        table.addRow('ID', client.user.id); 
        table.addRow('Node', process.version);
        table.addRow('Discord.js', discord.version);
        table.setAlign(0, asciiTable.CENTER);
        table.setAlign(1, asciiTable.CENTER);

        // Set the bot's status
        client.user.setPresence({
            status: "online",
            game: {
                name: "your requests",
                type: "LISTENING"
            }
        });
        
        // log connection table
        console.log(table.toString());
    }
};