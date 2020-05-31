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

        db.collection('scrims')
            .doc(focusedID)
            .get()
            .then(q => {
                let playersIDs = q.data().PlayersID;
                let subsIDS = q.data().SubsID;

                let players = q.data().Players;
                let subs = q.data().Subs;

                if (!playersIDs.includes(userID) && !subsIDS.includes(userID)) {
                    message.reply(username + ' did not apply!');
                    return
                }

                const nPlayers = players.filter(e => e !== username);
                const nSubs = subs.filter(e => e !== username);
                const nPlayersIDs = playersIDs.filter(e => e !== userID);
                const nSubsIDs = subsIDS.filter(e => e !== userID);

                // update db
                db.collection('scrims').doc(q.id).update({
                    'Subs': nSubs,
                    'SubsID': nSubsIDs,
                    'Players': nPlayers,
                    'PlayersID': nPlayersIDs
                }).then(() => {
                    message.channel.send('<@' + userID + '>you\'re no longer involved in the scrim');
                });
            });
    });
}

module.exports.help = {
    name: 'adminremove'
}