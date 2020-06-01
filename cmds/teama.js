module.exports.run = async (bot, message, args, db) => {

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

    if (args.length > 5) {
        message.channel.send('Teams can\'t exceed 5 players');
        return;
    }

    let mentions = [];
    message.mentions.users.forEach(u => {
        let id = u.id;
        let username = u.username;

        // find player displayname
        message.guild.members.cache.forEach(m => {
            if (m.user.id === id) {
                username = m.displayName;
            }
        });
        mentions.push({
            id: id,
            username: username
        });
    });

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();
            let teamA = [];
            let teamB = scrim.TeamB;
            let players = scrim.Players;
            let found = false;
            let l = 0;

            mentions.forEach(m => {
                found = false;
                players.forEach(p => {
                    if (p.id === m.id) {
                        found = true;
                        l++;
                    }
                });
                if (!found) {
                    message.channel.send('<@' + m.id + '> did not apply to play!');
                }
            });

            if (l === mentions.length) {
                found = false;
                mentions.forEach(m => {
                    teamB.forEach(p => {
                        if (p.id === m.id) {
                            message.channel.send('<@' + m.id + '> is already in another team!');
                            found = true;
                        }
                    })
                });

                if (!found) {

                    mentions.forEach(m => {
                        teamA.push(m);
                    });

                    let teamMessage = 'Team A: ';
                    mentions.forEach(m => {
                        teamMessage += '\n<@' + m.id + '>';
                    });
                    teamMessage += '\nCreated successfully!'

                    db.collection('scrims')
                        .doc(focusedID)
                        .update({
                            'TeamA': teamA
                        }).then(() => {
                            message.channel.send(teamMessage);
                        });
                }
            }
        });
}

module.exports.help = {
    name: 'teama'
}