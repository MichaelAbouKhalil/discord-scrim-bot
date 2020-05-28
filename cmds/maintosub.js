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

            if (message.mentions.users.keyArray().length + scrim.SubsID.length > scrim.NumberOfSubs) {
                message.reply('Number of players to add exceed the number of subs allowed');
                return;
            }

            message.mentions.users.forEach(u => {
                let username = u.username;
                let userID = u.id;

                let players = scrim.Players;
                let subs = scrim.Subs;
                let ids = scrim.PlayersID;
                let subsIds = scrim.SubsID;

                // if user already applied => ignore
                if (!ids.includes(userID)) {
                    message.reply(username + ' did not apply for main!');
                    return;
                }

                // if user already applied => ignore
                if (subsIds.includes(userID)) {
                    message.reply(username + ' already applied for subs!');
                    return;
                }

                // if number of player is maxed => ignore
                if (scrim.NumberOfSubs == subs.length) {
                    message.reply('Scrim subs is full!');
                    return;
                }

                subs.push(username);
                subsIds.push(userID);
                players = players.filter(item => item !== username);
                ids = ids.filter(item => item !== userID);

                // update db
                db.collection('scrims').doc(q.id).update({
                    'Players': players,
                    'PlayersID': ids,
                    'Subs': subs,
                    'SubsID': subsIds
                }).then(() => {
                    message.channel.send('<@' + userID + '> you\'ve been put down as a sub');
                });
            });
        });

}

module.exports.help = {
    name: 'maintosub'
}