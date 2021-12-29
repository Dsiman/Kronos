client = global.client
const { guilds, activities } = require('../models');
var _ = require('lodash');

module.exports = async (date) => {
    let timestamp = new Date().toLocaleTimeString();
    console.log(`////////////////////`)
    console.time(`Status, Activitiies, And Guild update\nTimestamp: ${timestamp}\nCompleted`);
    // Guild status object
    var guildact = {
        date: date,
        guilds: {}
    };

    for (let i = 0; i < client.guilds.cache.size; i++) {
        let vguild = client.guilds.cache.at(i)
        var bot = 0;
        // Handle guilds
        // check if the mongoose database has a record for this guild
        let guilddb = await guilds.findOne({ id: vguild.id })
        // Create a new guild record if one does not exist
        if (!guilddb) {
            guilddb = new guilds({
                id: vguild.id,
                name: vguild.name,
                rename: {},
                omit: [],
                games: {}
            })
            await guilddb.save()
        }
        guildact.guilds[vguild.id] = {};
        // Handle Guild Members
        for (let j = 0; j < vguild.members.cache.size; j++) {
            if (vguild.members.cache.at(j).user.bot) {
                bot=bot-1;   
                continue;
            }
            // define the member from the guild
            let member = vguild.members.cache.at(j)
            // update status 
            var ustatus = await client.functions.get('status')(date, member, vguild)
            if (ustatus) {
                guildact.guilds[vguild.id][j+bot] = ustatus
            }
            // define the user object
            var user = {
                id: member.id,
                name: member.user.username,
                nickname: member.nickname, 
                discriminator: member.user.discriminator,
                avatar: member.user.avatar
            }
            // if users does not contain the user
            if (!guilddb.users.filter(user => user.id === member.id).length > 0) {
                user.opt = {
                    Status: true,
                    Activity: true,
                    Speech: false,
                    Record: false
                }
                // add the user to the guild
                guilddb.users.push(user)
            }
            var useropt = guilddb.users.filter(user => user.id === member.id)[0].opt
            delete user.opt
            // if user changes
            if (!_.isEqual(user, guilddb.users.filter(user => user.id === member.id)[0])){

                // get the user index from the guilddb
                let index = _.findIndex(guilddb.users, { id: member.id })
                // update the user
                user.opt = useropt
                guilddb.users[index] = user
            }
        }
        // Handle Guild Channels
        for (let j = 0; j < vguild.channels.cache.size; j++) {
            let vchannel = vguild.channels.cache.at(j)
            let channels = guilddb.channels
            // if channels does not contain the channel, add them
            if (!channels.filter(channel => channel.id === vchannel.id).length > 0) {
                var channel = {
                    id: vchannel.id,
                    name: vchannel.name,
                    type: vchannel.type
                }
                guilddb.channels.push(channel)
            }
        }
        // save the guilddb
        await guilddb.save()
    }
    // save the activity
    act = new activities(guildact)
    await act.save()
    console.timeEnd(`Status, Activitiies, And Guild update\nTimestamp: ${timestamp}\nCompleted`);
}