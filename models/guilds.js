const mongoose = require('mongoose');

const guildsSchema = mongoose.Schema({
    id: String,
    name: String,
    users: Array,
    channels: Array,
    rename: Object,
    omit: Array
});


module.exports = mongoose.model('Guilds', guildsSchema);