const mongoose = require('mongoose');

const activitiesSchema = mongoose.Schema({
    date: Date,
    guilds: Object,
}); 


module.exports = mongoose.model('Activities', activitiesSchema);