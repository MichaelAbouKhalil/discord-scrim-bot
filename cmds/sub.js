module.exports.run = async (bot, message, args, db, FieldValue, prefix, bannedPlayers) => {

    // id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let username = message.author.username;
    let userID = message.author.id;

    message.guild.members.cache.forEach(m => {
        if (m.user.id === userID) {
            username = m.displayName;
        }
    });

    let player = {
        id: userID,
        username: username
    };

    let banned = false;
    bannedPlayers.forEach(b => {
        if (b.id === player.id) {
            message.reply("you are banned. Please contact scrim managers!");
            banned = true;
        }
    });

    if (banned) {
        return;
    }

    let filter = m => m.author.id === message.author.id;
    message.reply("if you're put down for the scrim, will you use a mic? Reply with yes or no within 15 secondss or else you'll have to start all over.")
        .then(r => r.delete({ timeout: 15000 }));

    message.channel.awaitMessages(filter, {
        max: 1,
        time: 15000,
        errors: ['time']
    }).then(collected => {

        if (collected.first().content.toLowerCase() === 'no') {
            return message.reply("in that case you can't participate in the scrim. Use of mic is mandatory. Sorry.");
        } else if (collected.first().content.toLowerCase() === 'yes') {

            db.collection('scrims')
                .doc(focusedID)
                .get()
                .then(q => {
                    let scrim = q.data();

                    // checking scrim status
                    if (scrim.state === 'close') {
                        message.channel.send('Scrim registration closed');
                        return;
                    }
                    if (scrim.state === 'cancelled') {
                        message.channel.send('Scrim registration cancelled');
                        return;
                    }

                    let players = scrim.Players;
                    let subs = scrim.Subs;
                    let exit = false;

                    // if user already applied => ignore
                    players.forEach(p => {
                        if (p.id === player.id) {
                            message.reply('already applied for main!');
                            exit = true;
                        }
                    });

                    // if user already applied => ignore
                    subs.forEach(s => {
                        if (s.id === player.id) {
                            message.reply('already applied for subs!');
                            exit = true;
                        }
                    });

                    // if number of player is maxed => ignore
                    if (scrim.NumberOfSubs == subs.length) {
                        message.reply('Scrim subs is full!');
                        exit = true;
                    }

                    if (!exit) {
                        subs.push(player);

                        // update db
                        db.collection('scrims').doc(q.id).update({
                            'Subs': subs
                        }).then(() => {
                            message.channel.send("<@"+ player.id + "> 👍 you've been put down for the scrim. Please note if you don't use your mic, you'll be banned from future scrims. Thanks.");
                        });
                    }
                });
        } else {
            return message.reply("only yes or no answers allowed.");
        }
    }).catch(err => { });
}

module.exports.help = {
    name: 'sub'
}