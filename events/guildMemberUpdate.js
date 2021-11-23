// Main function that runs on a presenceUpdate
module.exports = {
    name : 'guildMemberUpdate',
    once : false,
    description : 'Runs when a guildmember changes there member',
    async execute(oldMember, newMember) {
        const client = global.client;
        try {
            await client.functions.get('profiles')(newMember, 'Update')
        } catch (error) { console.error(error) }
    }
};
