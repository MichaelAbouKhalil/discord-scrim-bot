const Discord = require('discord.js');
const fs = require('fs');
require('dotenv/config');
const moment = require('moment');
require('moment-precise-range-plugin');
// const moment = require('moment.js');

// import settings
const owner = process.env.OWNER;
const token = process.env.TOKEN;
let prefix;
let focusedID = '1';
let bannedPlayers = [];

// initialize bot
const bot = new Discord.Client({ disableEveryone: false });
bot.commands = new Discord.Collection();

// initialise database (firebase)
const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

bot.on('ready', () => {
    focusedID = '1';
    let cmd = bot.commands.get('autofocus');
    cmd.run(bot, db);
    bot.user.setActivity('^help', { type: 'PLAYING' });
    console.log(bot.user.username + ' is online!');
});

fs.readdir('./cmds', (err, files) => {
    if (err) {
        console.log(err);
    }

    let cmdFiles = files.filter(f => f.split(".").pop() === "js");

    if (cmdFiles.length === 0) {
        console.log("No files found");
        return;
    }

    cmdFiles.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded`);
        bot.commands.set(props.help.name, props);
    })
})

bot.on('message', message => {
    // if another bot ignore
    if (message.author.bot) return;
    // if dm ignore
    if (message.channel.type === 'dm') return;
    // restrict channel: --scrims-internal -- general -- test
    let accessChannels = ['697087280518529035', '709725120381452289', '710381919770247168'];
    if (!accessChannels.includes(message.channel.id)) return;

    // if(message.channel.id === '697087280518529035'){
    //     message.channel.send('Bot under maintenance');
    //     return;
    // }

    db.collection('guilds').doc(message.guild.id).get().then((q) => {
        if (q.exists) {
            prefix = q.data().prefix;
            bannedPlayers = q.data().bannedPlayers;
        }
    }).then(() => {
        let msg_array = message.content.split(" ");
        let command = msg_array[0];
        let args = msg_array.slice(1);

        if (!command.startsWith(prefix)) return;

        if (bot.commands.get(command.slice(prefix.length))) {
            let cmd = bot.commands.get(command.slice(prefix.length));
            if (cmd) {
                cmd.run(bot, message, args, db, FieldValue, prefix, bannedPlayers, moment);
            }
        }
    })
});

bot.on('guildCreate', async gData => {
    db.collection('guilds').doc(gData.id).set({
        'guildID': gData.id,
        'guidName': gData.name,
        'guildOwner': gData.owner.user.username,
        'guildOwnerID': gData.ownerID,
        'guildMemberCount': gData.memberCount,
        'prefix': '!',
        'bannedPlayers': []
    });
});

bot.login(token);