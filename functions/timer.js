const client = global.client;
module.exports = async () => {
    setInterval(async () => {
        var date = new Date();
        if (date.getSeconds() == 0) {
            guilds(date)
        }
    }, 1000);
};

async function guilds(date) {
    client.functions.get('guilds')(date)
}
