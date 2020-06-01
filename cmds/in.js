module.exports.run = async (bot, message, args, db) => {

    //id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let username = message.author.username;
    let userID = message.author.id;

    // find player username
    message.guild.members.cache.forEach(m => {
        if (m.user.id === userID) {
            username = m.displayName;
        }
    });

    let player = {
        id: userID,
        username: username
    };

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();

            // check scrim status
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
                    message.reply("you've been put down to play scrim. ");
                });
            }
        });

}

module.exports.help = {
    name: 'in'
}