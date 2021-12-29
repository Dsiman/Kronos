const client = global.client;
const { activities, guilds } = require('../models');


module.exports = async (guildID) => {
    var data = [];
    var games = [];
    var found = false
    // todays date
    var today = new Date();
    // get the date for a week ago
    var lastweek = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 7));
    // get the date for a month ago
    var monthago = new Date(today.getTime() - (1000 * 60 * 60 * 24 * 30));
    var timestamp = new Date().toLocaleTimeString();
    console.time(`\nGuild ${guildID} updated gamemodes\nTimestamp: ${timestamp}\nCompleted`);
    // pull the activities
    var lastweekactivities = await activities.find({
        date: {
            $gte: monthago,
            $lt: today
        }
    });
    // for each activity entry
    for (var i = 0, len = lastweekactivities.length; i < len; i++) {
        // for each guild in the guilds object
        for (const [key, value] of Object.entries(lastweekactivities[i].guilds)) {
            // if the guild id is the same as the guild id in the config
            if (key === guildID) {
                // for each object in the guild
                for (const [key2, value2] of Object.entries(value)) {
                     // if value2 contains a activities object
                     if (typeof value2.activities !== 'undefined' && value2.status == 'online') {
                        // add the activities object to the data array
                        data.push(value2.activities);
                    }
                }
            }
        }
    }
    // for each data object
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].name == 'Custom Status') continue;
        if (!data[i].details) continue;
        // if the activity is in the games array
        const game = {
            name: data[i].name,
            mode: [data[i].details]
        };
        if (games.some(g => g.name === game.name)) {
            if (!games.find(g => g.name === game.name).mode.includes(data[i].details)) {
                games.find(g => g.name === game.name).mode.push(data[i].details);
            }
        } else {
            games.push(game);
        }
    };
    // get the guilds
    var guild = await guilds.findOne({ id: guildID });
    guild.games = games
    await guild.save()
    console.timeEnd(`\nGuild ${guildID} updated gamemodes\nTimestamp: ${timestamp}\nCompleted`);
    return;
};