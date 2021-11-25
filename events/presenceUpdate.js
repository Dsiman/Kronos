// Main function that runs on a presenceUpdate
module.exports = {
    name : 'presenceUpdate',
    once : false,
    description : 'Runs on a presenceUpdate',
    async execute(oldMember, newMember) {     
        const client = global.client;

        await client.functions.get('sessionmanager')(oldMember, newMember)

        /* If you wanted to quickly populate the database with a user's info, uncomment this and wait for a couple days.
        /* I wouldnt leave it uncommented, but it's a good example of how to quickly populate the database with a user's info.
        /*
        try {
            await client.functions.get('profiles')(newMember, 'Update')
        } catch (error) { console.error(error) }
        */
    }
};
