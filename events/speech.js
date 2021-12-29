const { addSpeechEvent } = require("discord-speech-recognition");
const path = require('path');
const fs = require('fs');
const prism = require('prism-media');
const {Duplex} = require('stream');
const { quotes, guilds } = require('../models');
// add event to Discord client
addSpeechEvent(global.client);

module.exports = {
    name : 'speech',
    once : false,
    description : 'Runs when a speech speaks',
    async execute(msg) {
		// ignore bots
		if (msg.author.bot) return;
		// ignore if message is not a parceable voice message
        if (msg.content != undefined) {
			// ignore the user if they are opted out
			// get the guild
			var guild = await guilds.findOne({  guildID: msg.guild.id});
			// get the user from guild
			var profile = guild.users.find(x => x.id === msg.author.id);
			// if user is opted out of recording, return
			if (profile.opt.Speech === false) return;
			console.time(`speech ${msg.author.username}`);
			// voice commands HERE
			//
			//
			//
			// if user is oped out of recording, return
			if (profile.opt.Record === false) {
				console.timeEnd(`speech ${msg.author.username}`);
				return;
			} 
			// Timestamp
			var date = new Date();
			var timestamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
			// Filepath
			const filePath = path.resolve("./","src","logs","audio");
			// Create file path if it doesn't exist
			try {
				fs.mkdirSync(filePath, { recursive: true } );
			} catch (e) {
				console.log('Cannot create folder ', e);
			}
			// Input
			const input = bufferToStream(msg.audioBuffer);
			// Output
			const output = fs.createWriteStream(`${filePath}/${msg.author.id}-${timestamp}.mp3`);
			// send the 48000hz 2ch 16bit pcm to FFmpeg
			const encoder = new prism.FFmpeg({
				args: [
					'-f', 's16le',
					'-ar', '48000',
					'-ac', '2',
					'-acodec', 'pcm_s16le',
					'-i', 'pipe:0',
					'-acodec', 'libmp3lame',
					'-ab', '128k',
					'-f', 'mp3',
					
				]	
			});
			// pipe the input with the encoder to the output
			input.pipe(encoder).pipe(output);

			var obj = {
				"date": date,
				"guildID": msg.guild.id,
				"userID" : msg.author.id,
				"transcript" : msg.content,
				"path" : path.join(filePath, `${msg.author.id}-${timestamp}.mp3`)
			}
			// make object into a document
			let quote = new quotes(obj);
			// save the document
			await quote.save();
			console.timeEnd(`speech ${msg.author.username}`);
		}
    }
};

function bufferToStream(myBuuffer) {
    let tmp = new Duplex();
    tmp.push(myBuuffer);
    tmp.push(null);
    return tmp;
}