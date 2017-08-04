//Modules
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const oneLine = require('common-tags').oneLine
const fs = require('fs');
//JSON Requires
const config = require('./config.json');
const songs = require('./songs.json');
const donators = require('./donators.json')
const help = require('./help.json')
//Core Stuff
const streamOptions = { seek: 0, volume: 1 };
const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}, I'm in ${client.guilds.size} server(s)`);
    console.log(`The total song count is ${songs.songs.length}`)
    let randomInt = Math.floor(Math.random() * songs.songs.length) + 0
    const SongToPlay = songs.songs[randomInt]
    const stream = ytdl(SongToPlay, { filter : 'audioonly' });
    broadcast.playStream(stream);
});

client.on('message', message => {
    if(message.author.bot === true) return;
    // if(message.mentions.users.first() !== client.user) return;
    if(message.content.startsWith(config.prefix) === false) return;
    const args = message.content.split(/\s+/g);
    console.log(args)
    if(message.content.includes(`start`)) {
    message.member.voiceChannel.join().then(connection => {
        const dispatcher = connection.playBroadcast(broadcast);
        message.channel.send(`Playing.`)
        }).catch(console.error);
    }
    if(message.content.includes(`stop`)) {
        if(message.guild.voiceConnection) {
            message.guild.voiceConnection.dispatcher.end()
            message.guild.voiceConnection.disconnect()
            message.reply(`Stopped`)
        }
    }
    if(message.content.includes(`ping`)) {
			message.reply('Pinging...').then((pingmessage) => {
                pingmessage.edit(oneLine`
				${message.channel.type !== 'dm' ? `${message.author},` : ''}
				Pong! The message round-trip took ${pingmessage.createdTimestamp - message.createdTimestamp}ms.`);
            })
    }
    if(message.content.includes(`suggest`)) {
        const embed = new Discord.RichEmbed()
        .setAuthor(message.author.tag, client.user.avatarURL)
        .setTitle(':bangbang: New Song Suggestion :musical_note:')
        .setDescription(`URL: ${args[1]}\nGuildID: ${message.guild.id}\nUserID: ${message.author.id}`)
        .setTimestamp();
        client.channels.get('342771044689510422').send({embed: embed}).then((suggestion) => {
            message.reply('Suggestion Sent.')
        })
    }
    if(message.content.includes(`invite`)) {
        message.reply(`You can add me here https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=36703232`)
    }
    if(message.content.includes(`help`)) {
        const embed = new Discord.RichEmbed()
            .setAuthor('Help', client.user.avatarURL);
            help.commands.map((command) => {
                embed.addField(command.name, command.desc)
            })
            embed.setTimestamp()
            embed.setFooter('Soundhax by Chronomly#8108')
            message.author.send({embed: embed})
    }
    if(message.content.includes(`info`)) {
        const embed = new Discord.RichEmbed()
            .setAuthor(`${client.user.username}`, client.user.avatarURL)
            .setColor(0x0099cc)
            .addField('Main information:', 'I am a Discord Bot made in **JavaScript** using the Discord API Wrapper **Discord.js** on the framework **Discord.js-Commando**', false)
            .addField('Developers:', '• Chronomoly6 •', false)
            .addField('Server Count:', `${client.guilds.size}`, true)
            .addField('Host', 'Not hosted perminatly yet', true)
            .setTimestamp()
            message.channel.send({ embed })
    }
    if(donators[message.author.id].rank === true) {
        if(message.content.startsWith(config.prefix+'don')) {
        if(args[1] === `join`) {
            if(message.member.voiceChannel) {
                message.member.voiceChannel.join().then((channel) => {
                    message.reply(`Joined \`${channel.channel.name}\``)
                })
            } else return message.reply('Your not in a voice channel.')
        }
        if(args[1] === `forceplay`) {
            if(message.guild.voiceConnection) {
                const donator_stream = ytdl(args[2], { filter : 'audioonly' });
                const info = ytdl.getInfo(args[2]).then((info) => {
                    let time = info.length_seconds
                    let minutes = Math.floor(time / 60);
                    let seconds = time - minutes * 60;
                    let hours = Math.floor(time / 3600);
                    time = time - hours * 3600;
                    const embed = new Discord.RichEmbed()
                        .setAuthor('Now Playing:', client.user.avatarURL)
                        .setDescription(`URL: ${info.video_url}\nTitle: ${info.title}\nAuthor: ${info.author.name}\nLength: ${time}`)
                        .setTimestamp()
                        .setImage(info.thumbnail_url);
                    message.guild.voiceConnection.playStream(donator_stream)
                    message.reply({embed: embed})
                })
            } else return message.reply('I\'m not in a voice channel here.')
        }
        if(args[1] === `np`) {
            if(message.guild.voiceConnection) {
                
            } else return message.reply('I\'m not in a voice channel here.')
        }
    }}
    //else {
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
    const SongToPlay = songs.songs[randomInt]
    const stream = ytdl(SongToPlay, { filter : 'audioonly' });
    broadcast.playStream(stream);
    let count = 0;
    broadcast.dispatchers.map((sub) => {
        count = count+1
    })
    client.user.setGame(`homebrew in ${count} vc(s)`)
});

client.login(config.token);