const mongoose = require('mongoose');
module.exports = async (date, member, guild) => {
    var activity = {
        userId: member.id
    }
    if (member.presence === null) {
        activity.status = 'offline';
    } else {
        activity.status = member.presence.status;
        if (member.voice.channel) {
            activity.channelId = member.voice.channel.id;
        }
        if (member.presence.activities != null && member.presence.activities[0] != undefined) {
            let o = Object.fromEntries(Object.entries(member.presence.activities[0]).filter(([_, v]) => v != null));
            if (o.assets) {
                o.assets = Object.fromEntries(Object.entries(o.assets).filter(([_, v]) => v != null));    
            }
            activity.activities = o;
        }
    }
    return activity;
}