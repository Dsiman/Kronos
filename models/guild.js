const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    id: String,
    name: String,
    users: Array,
    channels: Array
});


module.exports = mongoose.model('guild', guildSchema);