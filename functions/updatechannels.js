const { guilds } = require('../models');
client = global.client;

module.exports = async () => {
    let timestamp = new Date().toLocaleTimeString();
    console.time(`\nChannel Function Handler\nTimestamp: ${timestamp}\nCompleted`);
    var functions = {}
    for (let i = 0; i < client.guilds.cache.size; i++) {
        let vguild = client.guilds.cache.at(i)
        // Handle guilds
        // check if the mongoose database has a record for this guild
        let guilddb = await guilds.findOne({ id: vguild.id })
        if (guilddb == null) { return } ;
        functions[vguild.id] = [];
        functions[vguild.id].top = [];       
        // for each object in the channels array
        for (let j = 0; j < guilddb.channels.length; j++) {
            if (guilddb.channels[j].func) {
                // make a switch
                switch (guilddb.channels[j].func) {
                    case 'top':
                        var topfunc = {
                            guild: guilddb.id,
                            channel: guilddb.channels[j].id,
                            place: guilddb.channels[j].place,
                            timeframe: guilddb.channels[j].timeframe
                        }
                        functions[vguild.id].top.push(topfunc)
                        break;
                    default:
                        // nothing will happen.
                        break;
                }
            }
        }
    }
    await channelfunctions(functions)
    console.timeEnd(`\nChannel Function Handler\nTimestamp: ${timestamp}\nCompleted`);
};

async function channelfunctions(functions) {
    // for each guild
    for (const [key, value] of Object.entries(functions)) {
        for (const [key2, value2] of Object.entries(value)) {
            switch (key2) {
                case 'top':
                    // run the top games function for each guild
                    client.functions.get('top')(value2)
                    break;
                default:
                    break;
            }
        }
    }
}