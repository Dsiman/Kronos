const mongoose = require('mongoose');
const { Profile } = require('../models');
const ascii = require('ascii-table');

// this is used for getting user information on the other side of mongodb
module.exports = async (data, todo) => {
    //make a new ascii table
    const table = new ascii('Profile Event') 
    switch (todo) {
        case 'Create':
            // create a new profile
            const profile = {
                userID: data.user.id,
                username: data.user.username,
                avatar: data.user.avatar,
                tag: data.user.tag,
                nickname: data.nickname,
                opt: {
                    Speech: false,
                    Key: false
                },
            };
            // merge the profile with the id
            const mergedP = Object.assign({ _id: mongoose.Types.ObjectId() }, profile);
            const newProfile = await new Profile(mergedP);
            // save the profile
            return newProfile.save()
                .then(
                    //add row to ascii table
                    table.addRow("Event", "New"),
                    table.addRow("Username", data.user.username),
                    table.addRow("ID", data.user.id),
                    console.log(table.toString())
                )
                .catch(err => {
                    console.log(err)
                });
        break;
        case 'Update':
            // update a profile
            const profileUpdate = {
                userID: data.user.id,
                username: data.user.username,
                avatar: data.user.avatar,
                tag: data.user.tag,
                nickname: data.nickname,
            };
            // find the profile
            const profileToUpdate = await Profile.findOne({ userID: data.user.id });
            // if profile is not found return with error
            if (!profileToUpdate) {
                //add error to ascii table
                table.addRow("Event", "Error")
                table.addRow("User", data.user.username)
                table.addRow("ID", data.user.id)
                table.addRow("Error", "Profile not found")
                console.log(table.toString())
                return
            }
            // merge the profile with the id
            const mergedP2 = Object.assign({ _id: profileToUpdate._id }, profileUpdate);    
            // update the profile
            return profileToUpdate.updateOne(mergedP2)
                .then(
                    //add row to ascii table
                    table.addRow("Event", "Update"),
                    table.addRow("Username", data.user.username),
                    table.addRow("ID", data.user.id),
                    console.log(table.toString())
                )
                .catch(err => {
                    console.log(err)
                });
        break;

        case 'Delete':
            // delete a profile
            const profileToDelete = await Profile.findOne({ userID: data });
            // if profile is not found return with error
            if (!profileToDelete) {
                //add error to ascii table
                table.addRow("Event", "Error")
                table.addRow("User", data.user.username)
                table.addRow("ID", data.user.id)
                table.addRow("Error", "Profile not found")
                console.log(table.toString())
                return
            }
            // delete the profile
            return profileToDelete.deleteOne()
                .then(
                    //add row to ascii table
                    table.addRow("Event", "Delete"),
                    table.addRow("Username", data.user.username),
                    table.addRow("ID", data.user.id),
                    console.log(table.toString())
                )
                .catch(err => {
                    console.log(err)
                });
        break;
        // get profile by id
        case 'Get':
            // get the profile
            const userdata = await Profile.findOne({ userID: data });
            // if profile is not found return with error
            if (!userdata) {
                //add error to ascii table
                table.addRow("Event", "Error")
                table.addRow("User", data.user.username)
                table.addRow("ID", data.user.id)
                table.addRow("Error", "Profile not found")
                console.log(table.toString())
                return
            }
            // add row to ascii table
            table.addRow("Event", "Get")
            table.addRow("Username", data.user.username)
            table.addRow("ID", data.user.id)
            console.log(table.toString())
            return userdata
        break;
        
        default:
            break;
    }   
}