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
                    username : username
                };

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
            });
        });

}

module.exports.help = {
    name: 'adminin'
}