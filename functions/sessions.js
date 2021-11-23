const mongoose = require('mongoose');
const { Sessions } = require('../models');
const ascii = require('ascii-table');

module.exports = async (oldact, newact, todo, string, id) => {
    //make a new ascii table
    const table = new ascii('Session Event')    
    switch (todo) {
        //create a new session
        case 'Create' :
            const Session = {
                game: newact,
                userID: id,
                start: new Date(),
                ended: "Unfinished"
            };
            const mergedS = Object.assign({ _id: mongoose.Types.ObjectId() }, Session);   
            const newSession = await new Sessions(mergedS);
            return newSession.save()
                .then(
                    //add row to ascii table
                    table.addRow("Event", "New"),
                    table.addRow("User", string),
                    table.addRow("Game", newact),
                    table.addRow("Start", Session.start),
                    console.log(table.toString())
                    //if error
                ).catch(err => {
                    console.log(err);
                });
        break;
        // update a session
        case 'Update' :
            //get the session you are trying to update
            const session = await Sessions.findOne({ userID: id, game: oldact, ended: 'Unfinished' })
            //if session is not found return with message
            if (!session){
                //add error to ascii table
                table.addRow("Event", "Error")
                table.addRow("User", string)
                table.addRow("Game", oldact)
                table.addRow("Error", "Session not found")
                console.log(table.toString())
                return 
            }
            //subtract the start from end to get the duration
            const duration = new Date() - new Date(session.start)
            //make duration into hours minits and seconds
            const hours = Math.floor(duration / 3600000)
            const minutes = Math.floor((duration % 3600000) / 60000)
            const seconds = Math.floor(((duration % 3600000) % 60000) / 1000)
            //make timestring
            const timestring = hours + ":" + minutes + ":" + seconds
            //if the duration is less than 1 minitue or over 30 hours, then delete the session
            if(duration < 60000 || duration > 18000000){
                //add a row to the ascii table
                table.addRow("Event", "Deleted"),
                table.addRow("User", string),
                table.addRow("Game", oldact),
                table.addRow("Start", new Date(session.start)),
                table.addRow("End", new Date()),
                table.addRow("Duration", timestring)
                //console.log the table
                console.log(table.toString())
                //delete the session
                return await Sessions.deleteOne({_id: session._id})
            }
            //else update the session
            else{
                //add a row to the ascii table
                table.addRow("Event", "Updated"),
                table.addRow("User", string),
                table.addRow("Game", oldact),
                table.addRow("Start", new Date(session.start)),
                table.addRow("End", new Date()),
                table.addRow("Duration", timestring)
                //console.log the table
                console.log(table.toString())
                //update the session
                return await Sessions.updateOne({_id: session._id}, {end: new Date(), ended: 'Finished'})
                    .then(
                        //if error
                    ).catch(err => {
                        console.log(err);
                    }
                    );
            }
        break;
        // get the session you are trying to update
        case 'Get' :
            try {
                const gamedata = await Sessions.find({game: oldact, userID: id, ended: 'Unfinished'});
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;
        // get all sessions for a user
        case "GetUser" :
            try {
                const gamedata = await Sessions.find({ended: 'Finished', userID: id });
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;
        // get all sessions for a user by date range
        case "UserRange" :
            try {
                const gamedata = await Sessions.find({ended: 'Finished', userID: id, start: { $gte: oldact }, end: { $lte: newact }});
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;
        // get all sessions by gamename
        case "GetGame" :
            try {
                const gamedata = await Sessions.find({ended: 'Finished', game: oldact });
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;
        // get all sessions by date range
        case "GetAll" :
            try {
                const gamedata = await Sessions.find({ended: 'Finished', start: { $gte: oldact }, end: { $lte: newact }});
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;    
        // get all sessions
        case "GetAll2" :
            try {
                const gamedata = await Sessions.find({ended: 'Finished'});
                if (gamedata) {
                    return gamedata;
                } else {
                    return;
                }
            } catch (error) { console.error(error) };
        break;
        default: return
    };
};
