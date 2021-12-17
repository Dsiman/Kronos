const asciiTable = require('ascii-table');
const discord = require("discord.js");
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '9' }).setToken(process.env.token);

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

        // update slash commands
        try {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, '239310955639603200'),
                { body: slashcommandarray },
            );
            table.addRow('Slash Commands', 'Updated');
        } catch (error) {
            console.error(error);
        }
        
        // log connection table
        console.log(table.toString());
    }
};