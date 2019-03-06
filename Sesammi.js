const Discord = require('discord.js');
const client = new Discord.Client();
var token = require('./token');

var voiceChannel = null;


client.on('ready', () => {
console.log("Connected as " + client.user.tag);

})


client.on('message', (message) => {
    try {
    if (message.author == client.user || message.author.bot) { // Prevent bot from responding to its own / other bot messages
        return
    }

    if (message.content.startsWith(".")) {
        processCommand(message);
    }
    }
    catch (error) {
        console.log(error);
    }
})
//Handles commands
function processCommand(message) {
    try {
    let fullCommand = message.content.substr(1); // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + arguments); // There may not be any arguments
    if (primaryCommand.length < 1 || primaryCommand[0] == '.'){
        return;
    }
    if (primaryCommand == "help") {
        helpCommand(arguments, message);
    }
    else if (primaryCommand == "prune") {
        if (message.member.hasPermission(8192, false)) {
        pruneCommand(arguments, message);
        }
        else {
            message.channel.send("No permissions.");
        }
    }
    else if (primaryCommand == "perm"){
        permsCheckCommand(arguments, message);
    }
        
    else if (primaryCommand == "dm") {
        
        dmCommand(arguments, message);
    }
    else if (primaryCommand == "status") {
        statusCommand(arguments, message);
    }
    else if (primaryCommand == "join") {
        if (!message.guild) {
            return
        }
        
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
        voiceChannel = message.member.voiceChannel
        voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.reply('Connected!');
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  
    }
    else if (primaryCommand == "leave") {
        voiceChannel.leave();
    }
    
     else {
        message.channel.send("I don't understand the command. Try !help");
    }
        
    }
    catch (error) {
        console.log(error);
    }
}
//Help Command
function helpCommand(arguments, message) {
    if (arguments.length > 0) {
        message.channel.send("It looks like you might need help with " + arguments);
    } else {
        message.channel.send("I'm not sure what you need help with. Try .help [topic]");
    }
}
//Join voice channel
function joinVoiceCommand(arguments, message) {
    try {
        this.voiceChannel = message.guild.channels.get(arguments);
        this.voiceChannel.join();
    }
    catch (error) {
        console.log(error);
    }
    
}
//Leave voice channel
function leaveVoiceCommand(arguments, message) {
    
    try {
        this.voiceChannel.leave();
    }
    catch (error) {
        console.log(error);
    }
}

//Set Bot's status
function statusCommand(arguments, message) {
    try {
        if (message.member.hasPermission(8, false)) {
        client.user.setPresence({ game: { name: arguments.slice(1).join(' ') }, status: arguments[0] });
        }
        else {
            message.channel.send("No permissions.");
        }
        
    }
    catch (error) {
        console.log(error);
    }
}
//DM a user through the Bot
function dmCommand(arguments, message) {
    //message.member.createDM.send(message)
    try {
    let user = message.mentions.users.first(); //grabbing the user mention
        console.log(message.mentions.users);
    let msg = arguments.slice(1).join(' ');
    user.send(message.author + ": " + msg);
    }
    catch (error) {
        console.log(error);
    }
}
//Prune messages
function pruneCommand(arguments, message) {
    try {
    if (arguments == "all") {
        for(var i = 0; i < 100; i++) {
        pruneCommand(100, message);
        }
    }
    else if (arguments.length < 1) {
        pruneCommand(1, message);
    }
    else {
      let num = parseInt(arguments);
    message.channel.bulkDelete(num); 
    }
    }
    catch (error) {
        console.log(error);
    }
    
    
}
//Check user's permissions
function permsCheckCommand(arguments, message) {
    try {
    message.channel.send(message.member.hasPermission(8192, false));
    }
    catch (error) {
        console.log(error);
    }
    
}




client.login(token.val);
