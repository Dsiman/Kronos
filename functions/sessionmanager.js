module.exports = async (oldMember, newMember) => {
    // This is one of the first things I have ever written in javascript. I am so sorry.
    // I want to rewrite this but I am not sure how to do it.
    // "If its not broken, don't fix it."
    // - Lazy programmer
    const client = global.client;
    
    var notgames = client.config.notgames;

    var offlinestates = [
    'dnd',
    'idle',
    'offline'
    ]

    if (newMember.bot){
        return
    }

    var newact = {name : "newact"}
    var oldact = {name : "oldact"}
    var oldstate = {name : "offline"}
    
    var newstate = newMember['status']

    //if oldstate is undefined
    if (oldMember != undefined){
        oldstate = oldMember['status']
    }
    if (oldMember != undefined) {
        if (newMember['activities'][0] == undefined){      
            newact = {name : "newact"}
        } else {
            newact = newMember['activities'][0]
        }
    }

    if (oldMember != undefined) {
        if (oldMember['activities'][0] == undefined){
            oldact = {name : "oldact"}
        } else {
            oldact = oldMember['activities'][0]
        }
    }
    
    const UserID = newMember.user.id
    const username = newMember.user.username

    // Coming online
    if (newstate == 'online' && offlinestates.includes(oldstate)){
        // If newact is undefined it means that the user isnt playing anything
        if (newact["name"] == "newact") {
        
            return
        }
        // If newact includes any of the games/activitys that we dont want tracked
        if (notgames.includes(newact["name"])){
            return
        }
        // If newact is = to oldact then that means they are doing the same game/activity
        if (newact["name"] == oldact["name"]) {
            await client.functions.get('sessions')(oldact["name"], newact["name"], "Create", username, UserID)
            return
        }
        // If none of the previous statments are true then take the new game they are playing and start a session
        await client.functions.get('sessions')(oldact["name"], newact["name"], "Create", username, UserID)
        return
    }

    // Going afk
    if (offlinestates.includes(newstate) && oldstate == 'online'){
        
        // user has gone offline
        if (oldact["name"] == "oldact"){
        }
        // user has gone offline and was playing a game
        if (oldact["name"] != "oldact"){
            // If user was playing a game stop the session
            if (oldact["name"] != undefined && !notgames.includes(oldact["name"])){
                // get the last game played       
                let Oldgame = await client.functions.get('sessions')(oldact["name"], newact["name"], "Get", username, UserID)
                for (let i = 0; i < Oldgame.length; i++) {
                    await client.functions.get('sessions')(oldact["name"], newact["name"], "Update", username, UserID)
                }
            }
        }
    }
    
    // Starting a game
    if (newstate == 'online' && !offlinestates.includes(oldstate)){
        // If newact includes any of the games/activitys that we dont want tracked
        if (notgames.includes(newact["name"])){
            return
        }
        // If newact is = to oldact then that means they are doing the same game/activity
        if (newact["name"] == oldact["name"]) {
            return
        }
        if (oldact["name"] == "oldact" && newact["name"] != "newact"){
            // If none of the previous statments are true then take the new game they are playing and start a session
            await client.functions.get('sessions')(oldact["name"], newact["name"], "Create", username, UserID)
            return
        }
        if (oldact["name"] != "oldact" && newact["name"] == "newact"){
            // If none of the previous statments are true then take the new game they are playing and start a session
            await client.functions.get('sessions')(oldact["name"], newact["name"], "Update", username, UserID)
            return
        }
        if (oldact["name"] != "oldact" && newact["name"] != "newact" && newact["name"] != oldact["name"]){
            // If none of the previous statments are true then take the new game they are playing and start a session
            let Oldgame = await client.functions.get('sessions')(oldact["name"], newact["name"], "Get", username, UserID)
            for (let i = 0; i < Oldgame.length; i++) {
                await client.functions.get('sessions')(oldact["name"], newact["name"], "Update", username, UserID)
            }
            await client.functions.get('sessions')(oldact["name"], newact["name"], "Create", username, UserID)
            return
        }
    }
    
};