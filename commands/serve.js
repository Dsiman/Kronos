const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { quotes, guilds } = require('../models');
const fs = require('fs');
client = global.client
module.exports = {
    data: new SlashCommandBuilder()
    .setName('serve')
    .setDescription('Replies with a file that is close to the search term')
    .addStringOption(option => {
		return option
            .setName('search')
			.setDescription('transcript to search for')
			.setRequired(true)
    }),
    async execute(interaction) {
        const string = interaction.options.getString('search');
        // find one in quotes where transcript = string
        let quote = await quotes.findOne({
            "transcript" :{$regex: string}
            });
        // if no quote found, return
        if (!quote) {
            return interaction.reply({ content: 'No quote found', ephemeral: true });
        }
            // get the guild
        var guild = await guilds.findOne({ guildID: quote.guildID });
        // get the user from guild
        var profile = guild.users.find(x => x.id === quote.userID);
        if (profile.nickname == null) {
            username = profile.name;
        } else {
            username = profile.nickname;
        }
        // if quote found, return file 
        const file = new MessageAttachment(quote.path);
        const exampleEmbed = new MessageEmbed()
            .setTitle(`"${quote.transcript}." \n-${username}`)
            interaction.reply({ embeds: [exampleEmbed], files: [file] });
    }
}