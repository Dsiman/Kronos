const client = global.client;
const { activities, guilds } = require('../models');

var icon = [
    '🥇',
    '🥈',
    '🥉'
]

module.exports = async (channels) => {
    // a cache of the top games only pulled for whatever set of time the function was looking for.
    var gamedata = {
        day:    [],
        week:   [],
        month:  [],
        year:   []
    };
    // rename and omit array that get populated with what games the guild wants to rename or omit
    var rename = [];
    var omit = [];
    for (let i = 0; i < channels.length; i++) {
        console.time('top')
        // attempt to get the guild from the database and fill the function cache
        if (gamedata[channels[i].timeframe].length === 0) {
            var datetime = await gettime(channels[i].timeframe)
            gamedata[channels[i].timeframe] = await pullgamesfrommonth(datetime.first, datetime.last, channels[i].guild)
        }
        // populate the rename and omit arrays if they are empty
        if (rename.length === 0 || omit.length === 0) {
            var { rename, omit } = await getedits(channels[i].guild);
        }
        // clear anything that is garbage
        for (let d = 0; d < channels.length; d++) {
            // check if the game is in the omit array
            if (omit.length != 0) {
                // check if the name is in the omit array
                for (let j = 0; j < omit.length; j++) {
                    if (gamedata[channels[d].timeframe][channels[d].place-1].name == omit[j]) {
                        // if it is then set the name to the value
                        gamedata[channels[d].timeframe].splice(channels[d].place-1, 1)
                        break;
                    }
                }
            }
        }
        // end if there isnt any gametime data
        if (gamedata[channels[i].timeframe].length === 0) { 
            console.timeEnd('top')
            continue;
        }
        // get guild
        var guild = await client.guilds.fetch(channels[i].guild)
        // get channel
        var voicechannel = await guild.channels.cache.find(x => x.id === channels[i].channel);
        // Time to Days Hours Mins
        var time = await formattime(gamedata[channels[i].timeframe][channels[i].place-1].time);
        // set the game name
        var name = await gamedata[channels[i].timeframe][channels[i].place-1].name;
        // check if the game is in the rename array
        if (rename.length != 0) {
            // check if the name is in the rename array
            for (const [key, value] of Object.entries(rename)) {
                // check if the name is in the object
                if (name == key) {
                    // if it is then set the name to the value
                    name = value;
                    break;
                }
            }
        }
        // Edit the voicechannel name
        if (channels.length <= 3) {
            // if there is only 3 channels then use the icon
            voicechannel.setName(`${icon[channels[i].place-1]} ${name} ${time}`); 
            console.timeEnd('top')
            continue;
        } else {
            // if there are more than 3 channels just use name and time FOR NOW
            voicechannel.setName(`${name} ${time}`);
            console.timeEnd('top')
            continue;
        }
    }
}
    
// Get the first and last date for the timeframe
async function gettime(timeframe){
    let date = new Date();
    // return a time based on the timeframe string
    switch (timeframe) {
        case 'day':
            var first = new Date(date.getFullYear(), date.getMonth(), 1);
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {first, last};
        case 'week':
            var first = new Date(date.getFullYear(), date.getMonth(), 1);
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {first, last};
        case 'month':
            var first = new Date(date.getFullYear(), date.getMonth(), 1);
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {first, last};
        case 'year':
            var first = new Date(date.getFullYear(), date.getMonth(), 1);
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {first, last};
        default:
            var first = new Date(date.getFullYear(), date.getMonth(), 1);
            var last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return {first, last};
    }
}
    
// Pull games from a set of time and by guild
async function pullgamesfrommonth(first, last, guildid) {
    var data = [];
    var organized = [];
    var found = false
    // get activities from the database where the date is greater than the first date and less than the last date
    var topgames = await activities.find({date: { $gte: first }, date: { $lte: last }});
    // for each activity
    for (var i = 0, len = topgames.length; i < len; i++) {
        // for each guild in the guilds object
        for (const [key, value] of Object.entries(topgames[i].guilds)) {
            // if the guild id is the same as the guild id in the config
            if (key === guildid) {
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
        // if the activity is in the organized array
        const game = {
            name: data[i].name,
            time: 1,
        };
        for (let b = 0; b < organized.length; b++) {
            if(organized[b].name == data[i].name){
                const updatedgame = {
                    name: data[i].name,
                    time: organized[b].time + 1,
                };
                organized[b] = updatedgame
                found = true
                break   
            }
        };
        if (found == false){
            organized.push(game)
        }
        found = false
            
    };
    organized.sort((a, b) => b.time - a.time);
    // return the top games and status
    return organized;
}
    
// Time to Days Hours Mins
async function formattime(mins) {
    // get the hours
    var hours = Math.floor(mins / 60);
    // get the minutes
    var minutes = mins % 60;
    // if the hours is greater than 0
    if (hours > 0) {
        // return the hours and minutes
        return `${hours}h ${minutes}m`;
    } else {
        // return the minutes
        return `${minutes}m`;
    }
}
    
// get renamed times from guilddb
async function getedits(guildid) {
    // get the guild from the database
    var guild = await guilds.find({ id: guildid });
    // return the guild rename array
    var rename = guild[0].rename;
    var omit = guild[0].omit;
    return {rename, omit};
}