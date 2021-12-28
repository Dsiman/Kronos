const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { quotes } = require('../models');
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
            where: {
                transcript: string
            }
        });
        // if no quote found, return
        if (!quote) {
            return interaction.reply({ content: 'No quote found', ephemeral: true });
        }
        // if quote found, return file 
        const file = new MessageAttachment(quote.path);
        const exampleEmbed = new MessageEmbed()
            .setTitle(`"${quote.transcript}." -${quote.userID}`)
            interaction.reply({ embeds: [exampleEmbed], files: [file] });
    }
}
//Latency is ${Date.now() - interaction.message.createdTimestamp}ms. 