const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();
const config = require('./config.json');
const songs = require('./songs.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, I'm in ${client.guilds.size} server(s)`);
    console.log(`The total song count is ${songs.songs.length}`)
    let randomInt = Math.floor(Math.random() * songs.songs.length) + 0
    let SongToPlay = songs.songs[randomInt]
    const stream = ytdl(SongToPlay, { filter : 'audioonly' });
    broadcast.playStream(stream);
}); 

client.on('message', message => {
    if(message.author.bot === true) return;
    if(message.content.startsWith('<@342469635037462528>') !== true) return;
    const args = message.content.split(/\s+/g);
    if(args[1] === `play`) {
    message.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playBroadcast(broadcast);
        message.reply(`Now Playing`)
        }).catch(console.error);
    }
    if(args[1] === `stop`) {
        if(message.guild.voiceConnection) {
            message.guild.voiceConnection.dispatcher.end()
            message.guild.voiceConnection.disconnect()
            message.reply(`Ban wave inbound, I better leave.`)
        }
    }
}); 

//Broadcast Handling
broadcast.on('subscribe', () => {
    let count = 0;
    broadcast.dispatchers.map((sub) => {
        count = count+1
    })
    client.user.setGame(`homebrew in ${count} vcs`)
}); 

broadcast.on('end', () => {
    let randomInt = Math.floor(Math.random() * songs.songs.length) + 0
    let SongToPlay = songs.songs[randomInt]
    const stream = ytdl(SongToPlay, { filter : 'audioonly' });
    broadcast.playStream(stream);
    let count = 0;
    broadcast.dispatchers.map((sub) => {
        count = count+1
    })
    client.user.setGame(`homebrew in ${count} vcs`)
});
 
client.login(config.token);