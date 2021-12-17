const { SlashCommandBuilder } = require('@discordjs/builders');
client = global.client
module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Latency, and API Latency'),
    async execute(interaction) {
        await interaction.reply({ content: `🏓API Latency is ${Math.round(client.ws.ping)}ms`,  ephemeral: true });
    }
}
//Latency is ${Date.now() - interaction.message.createdTimestamp}ms. 