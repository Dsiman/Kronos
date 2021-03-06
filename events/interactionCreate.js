client = global.client
module.exports = {
    name : 'interactionCreate',
    once : false,
    description : 'Runs on a interactionCreate',
    async execute(interaction) {

        if (!interaction.isCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
    
        if (!command) return;
    
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }
};
