require('dotenv').config()
const { Client, Collection, Intents } = require("discord.js");
const fs = require('fs');
const ascii = require("ascii-table");

//discord.js client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

// Collections
client.functions = new Collection();
client.config = require('./config.js');
//make the client global
global.client = client;
//print arrays
functionarray = [];
eventarray = [];

//define a table for the arrays to populate
var table = new ascii('Loaded Files')
    .setHeading('Function', 'Events')
    .setAlign(0, ascii.CENTER)
    .setAlign(1, ascii.CENTER)
    .setAlign(2, ascii.CENTER);

//Function handler
fs.readdir('./functions/', async (err, files) => {
    files.forEach( file => {
        if (!file.endsWith('.js')) return;
        let pull = require(`./functions/${file}`);
        let functionsname = file.split('.')[0];
        client.functions.set(functionsname, pull);
        functionarray.push(functionsname);
        if (err) { 
            return console.error;       
        }
    });
});

//Event handler 
fs.readdir('./events/', async (err, files) => {
    files.forEach( file => {
        if (!file.endsWith('.js')) return;
        let event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        eventarray.push(event.name);
        if (err) { 
            return console.error;       
        }
    });
});

//Move the arrays to ascii table
function printarray() {
    //Find the biggest array
    var max = Math.max(functionarray.length, eventarray.length);
    //make and print loaded functions and events
    for (i = 0; i < max; i++) {
        table.addRow(functionarray[i], eventarray[i]);
    }

    return table.toString();
}

//client init
setTimeout(
    async function()  
        {
            try{
                //Connect to Discord 
                await client.login(process.env.token)
                
                //connect to Mongoose(MongoDB API)
                await client.functions.get('mongoose')(client);

                //log information guilds,users,status per minute
                await client.functions.get('timer')();
                
                //Log Arrays into console
                console.log(printarray());

            } catch (error) { console.error(error) }
        },
    3000
);