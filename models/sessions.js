const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
	game: { type: String, index: true },
	userID: { type: String, index: true },
	start: Date,
	end: Date,
    ended: { type: String, index: true }
});

module.exports = mongoose.model('Sessions', sessionSchema);