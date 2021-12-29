const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { guilds } = require('../models');


var Keyvalue = ""
var useropt = [
    //speech detection
    {
        label: "Speech Detection",
        description: "In a voice chat, the bot will listen your voice",
        value: "Speech"
    },
    //Record Speech
    {
        label: "Recording voice",
        description: "Attemp to transcribe and save your voice.",
        value: "Record"
    },
    //Record Status
    {
        label: "Record Status",
        description: "Save your online status.",
        value: "Status"
    },
    //Record Activity IE games, youtube, etc
    {
        label: "Record Activity",
        description: "Record your gametime.",
        value: "Activity"
    },
]

module.exports = {
    data: new SlashCommandBuilder()
    .setName('opt')
    .setDescription('There is some functionality that needs your permission to work'),
    async execute(interaction) {
        // get the guild
        var guild = await guilds.findOne({  guildID: interaction.guild.id });
        // get the user from guild
        var profile = guild.users.find(x => x.id === interaction.member.id);
        //make a message select menu for the user to select a useropt from
        const embed = new MessageEmbed()
            .setTitle("kronos's Options")
            .setDescription("Select an option from the dropdown.\nCurrent Options set to:")
            .setColor("#0099ff")

        //add readout for each useropt
        for (var i = 0; i < useropt.length; i++) {
            embed.addField(useropt[i].label.toString(), profile.opt[useropt[i].value].toString())
        }
        //create a message select menu for the user to select a useropt from
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("useropt") 
                    .setPlaceholder("Select an option")
                    .addOptions(useropt)
            )
        
        //create message collector
        const filter = (interaction) => {
            
            interaction.deferReply({ephemeral: true});
            return interaction.isSelectMenu() && interaction.message.author.id === interaction.author.id;
        }

        const collector = interaction.channel.createMessageComponentCollector(filter, { time: 1000 }, { idle: 1000 }, true);

        collector.on('collect', async (collected) => {
            if(collected.customId === "useropt"){
                //for loop to check if the collected value is equal to the value in the useropt array
                for(var i = 0; i < useropt.length; i++){
                    if(collected.values[0] === useropt[i].value){
                        setKey(collected.values[0], collected);
                        Keyvalue = collected.values[0];
                    }
                }
            }
            if(collected.customId === "UpdateValue"){
                await setValue(Keyvalue, collected);
                collector.stop();
            }
        });
        
        //send the interaction
        interaction.reply({embeds: [embed], components: [row], ephemeral: true});
    },
    async run(client, message, args) {
        //build rich embed
        const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Use: /Opt')
        .setDescription('Opt is a command that lets you set your prefrences for interacting with the bot.\nThis bot has voice reconition and will attempt to proccess what you are saying if you do enable it.')


        //dm rich embed
        await message.author.send({embeds: [embed]});
    }
}

async function setKey(type,  interaction){
    await interaction.deferUpdate();
    
    // get the guild
    var guild = await guilds.findOne({  guildID: interaction.guild.id });
    // get the user from guild
    var profile = guild.users.find(x => x.id === interaction.member.id);

    const value = profile.opt[type]
                        
    //set lable and description to the inverse of the current value                  
    if (value == false) {                     
        var lable = "Enable";
        var description = "Enable this feature";
        var descriptor = "Disabled";
    } else {
        var lable = "Disable";
        var description = "Disable this feature";
        var descriptor = "Enabled";
}
                    
    //generate a rich embed with a description
    var Embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(useropt[0].label.toString())
        .setDescription(useropt[0].description.toString())
        .addField('Option is currently '+ descriptor, '\u200b')
    //generate a message action row with the lable and description
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('UpdateValue')
                .setLabel(lable)
                .setStyle('PRIMARY'),
        );
    //send the embed
    await interaction.editReply({embeds: [Embed], components: [row]});
}

//a function to set the values to true or false on the database
async function setValue(type,  interaction){
    await interaction.deferUpdate();
    // get the guild
    var guild = await guilds.findOne({  guildID: interaction.guild.id });
    // get the user from guild
    var profile = guild.users.find(x => x.id === interaction.member.id);
    //set the value to the inverse of the current value
    profile.opt[type] = !profile.opt[type];
    //overwrite the user in the database
    await guilds.updateOne({guildID: interaction.guild.id, "users.id": interaction.member.id}, {$set: { "users.$": profile }});
    //get lable from useropt array where value is equal to the type
    var lable = useropt.find(x => x.value === type).label;
    // make embed to read out the new value
    const embed = new MessageEmbed()
    .setTitle("Succsess")
    .setDescription(lable + " has been set to " + profile.opt[type])
    .setColor("#0099ff")
    .addField("More info:", "Current Options set to:")
    
    //get the value of the key
    for (var i = 0; i < useropt.length; i++) {
        embed.addField(useropt[i].label.toString(), profile.opt[useropt[i].value].toString())
    }

    await interaction.editReply({embeds: [embed], components: []});
}