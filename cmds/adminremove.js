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

    // id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
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

        db.collection('scrims')
            .doc(focusedID)
            .get()
            .then(q => {
                let players = q.data().Players;
                let subs = q.data().Subs;
                let found = false;

                // if user already applied for mains
                players.forEach(p => {
                    if (p.id === player.id) {
                        found = true;
                    }
                });

                // if user already applied for subs
                subs.forEach(s => {
                    if (s.id === player.id) {
                        found = true;
                    }
                });

                if (!found) { // if did not apply
                    message.reply('you did not apply!');
                } else { // if found, remove from lists and update db
                    let nPlayers = players.filter(e => e.id !== player.id);
                    let nSubs = subs.filter(e => e.id !== player.id);

                    // update db
                    db.collection('scrims').doc(q.id).update({
                        'Players': nPlayers,
                        'Subs': nSubs
                    }).then(() => {
                        message.channel.send('<@' + player.id + '>you\'re no longer involved in the scrim');
                    });
                }
            });
    });
}

module.exports.help = {
    name: 'adminremove'
}