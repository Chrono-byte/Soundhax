const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();
const oneLine = require('common-tags').oneLine
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
    // if(message.mentions.users.first() !== client.user) return;
    if(message.content.startsWith('s!') === false) return;
    const args = message.content.split(/\s+/g);
    console.log(args)
    if(message.content.includes(`start`)) {
    message.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playBroadcast(broadcast);
        message.reply(`Your listening to Soundhax Radio!`)
        }).catch(console.error);
    } else
    if(message.content.includes(`stop`)) {
        if(message.guild.voiceConnection) {
            message.guild.voiceConnection.dispatcher.end()
            message.guild.voiceConnection.disconnect()
            message.reply(`Ban wave inbound, I better leave.`)
        }
    } else
    if(message.content.includes(`ping`)) {
			message.reply('Pinging...').then((pingmessage) => {
                pingmessage.edit(oneLine`
				${message.channel.type !== 'dm' ? `${message.author},` : ''}
				Pong! The message round-trip took ${pingmessage.createdTimestamp - message.createdTimestamp}ms.`);
            })
    } //else {
    //     message.reply(`Hello, I'm Soundhax a music bot by Chronomly#8108, if you need to learn the commands do @Soundhax help or s!help, if you need something ***really*** bad join https://discord.io/chrono and mention \`@Support\``)
    // }
}); 

//Broadcast Handling
broadcast.on('subscribe', () => {
    let count = 0;
    broadcast.dispatchers.map((sub) => {
        count = count+1
    })
    client.user.setGame(`homebrew in ${count} vc(s)`)
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
    client.user.setGame(`homebrew in ${count} vc(s)`)
});

client.login(config.token);