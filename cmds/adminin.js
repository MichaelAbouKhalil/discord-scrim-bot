module.exports.run = async (bot, message, args, db, FieldValue, prefix, bannedPlayers) => {

    // role check
    const accessRoles = ['Scrim Manager'];
    let canAccess = false;
    if (message.member.roles.cache.some(r => accessRoles.includes(r.name))) {
        canAccess = true;
    }
    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    //id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    if (args.length != 1) {
        message.reply("please mention only 1 player");
        return;
    }


    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();

            if (message.mentions.users.keyArray().length + scrim.Players.length > scrim.NumberOfPlayers) {
                message.reply('Number of players to add exceed the number of players allowed');
                return;
            }

            message.mentions.users.forEach(u => {
                let username = u.username;
                let userID = u.id;

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
                        message.reply("this player is banned");
                        banned = true;
                    }
                });

                if (banned) {
                    return;
                }

                let filter = m => m.author.id === message.author.id;
                message.reply("Before this player gets added, can you confirm he/she will use a mic? Answer with yes or no. **expires in 10 seconds**")
                    .then(r => r.delete({ timeout: 10000 }));

                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 10000,
                    errors: ['time']
                }).then(collected => {

                    if (collected.first().content.toLowerCase() === 'no') {
                        return message.reply("Unfortunately player can't be added due to no use of mic.");
                    } else if (collected.first().content.toLowerCase() === 'yes') {
                        let players = scrim.Players;
                        let subs = scrim.Subs;
                        let exit = false;

                        // if user already applied => ignore
                        players.forEach(p => {
                            if (p.id === player.id) {
                                message.reply(player.username + ' already applied for main!');
                                exit = true;
                            }
                        });

                        // if user already applied => ignore
                        subs.forEach(s => {
                            if (s.id === player.id) {
                                message.reply(player.username + ' already applied for subs!');
                                exit == true;
                            }
                        });

                        // if number of player is maxed => ignore
                        if (scrim.NumberOfPlayers == players.length) {
                            message.reply('Scrim mains is full!');
                            exit = true;
                        }

                        if (!exit) {
                            players.push(player);

                            // update db
                            db.collection('scrims').doc(q.id).update({
                                'Players': players
                            }).then(() => {
                                message.channel.send('<@' + player.id + '> you\'ve been put down to play scrim');
                            });
                        }
                    } else {
                        return message.reply("only yes or no answers allowed.");
                    }
                }).catch(err => { });
            });
        });
}

module.exports.help = {
    name: 'adminin'
}