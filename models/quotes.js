const mongoose = require('mongoose');

const quotesSchema = mongoose.Schema({
    date: Date,
    guildID: String,
    userID: String,
    transcript: String,
    path: String
});


module.exports = mongoose.model('Quotes', quotesSchema);