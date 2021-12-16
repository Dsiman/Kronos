const client = global.client;
module.exports = async () => {
    setInterval(async () => {
        var date = new Date();
        if (date.getSeconds() == 0) {
            if (global.seconds){
                // Lockout bool
                global.seconds = false;
                // Functions to run every minute
                client.functions.get('guilds')(date)
                if (date.getMinutes() % 10 == 0) {
                    // Functions to run every 10 minutes
                    client.functions.get('updatechannels')(date)
                }
                // Lockout reset timer
                setTimeout(async () => { 
                    global.seconds = true;
                }, 1000);
            }
        }
    }, 900);
};