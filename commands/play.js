const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require("@discordjs/voice");
client = global.client
module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Attempts to play a song from YouTube')
    .addStringOption(option => {
		return option
            .setName('search')
			.setDescription('Name, URL, or ID of the song to play')
			.setRequired(true)
    }),
    async execute(interaction) {
        const { member } = interaction;
        const string = interaction.options.getString('search');
        // Check if user is in the voice channel already
        if (!member.voice.channel) { 
            return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
        }
        
        
        // Here you go vik!
        
        
        //join members voice channel
        const connection = await joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: member.guild.id,
            adapterCreator: member.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false,
        });
    }
}