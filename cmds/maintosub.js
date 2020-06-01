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


    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();

            if (message.mentions.users.keyArray().length + scrim.Subs.length > scrim.NumberOfSubs) {
                message.reply('Number of players to add exceed the number of subs allowed');
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
                    username : username
                };

                let players = scrim.Players;
                let subs = scrim.Subs;
                let found = false;

                // check if player in main
                players.forEach(p => {
                    if (p.id === player.id) {
                        found = true;
                    }
                });
                if(!found){ // player not in main
                    message.reply(player.username + ' did not apply for main!');
                }else{
                    found = false;
                    // if user already applied in sub
                    subs.forEach(s => {
                        if (s.id === player.id) {
                            message.reply(player.username + ' already applied for subs!');
                            found = true;
                        }
                    });

                    // if number of player is maxed => ignore
                    if (scrim.NumberOfSubs == subs.length) {
                        message.reply('Scrim subs is full!');
                        found = true;
                    }

                    if (!found) {
                        // add player to subs
                        subs.push(player);
                        // remove player from mains
                        players = players.filter(item => item.id !== player.id);

                        // update db
                        db.collection('scrims').doc(q.id).update({
                            'Players': players,
                            'Subs': subs
                        }).then(() => {
                            message.channel.send('<@' + player.id + '> you\'ve been put down as a sub');
                        });
                    }
                }
            });
        });

}

module.exports.help = {
    name: 'maintosub'
}