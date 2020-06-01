module.exports.run = (bot, message, args, db) => {

    // id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {

            if (q.exists) {
                let exit = false;
                if (q.data().state === 'cancelled') {
                    message.channel.send('UPCOMING SCRIM CANCELLED!');
                    exit = true;
                }

                if (!exit) {

                    let players = q.data().Players;
                    let subs = q.data().Subs;
                    let playersMsg = (players.length === 0) ? 'NONE' : '';
                    let subsMsg = (subs.length === 0) ? 'NONE' : '';

                    players.forEach(p => {
                        playersMsg += p.username + '\n';
                    });

                    subs.forEach(s => {
                        subsMsg += s.username + '\n';
                    });
                    message.channel.send({
                        embed: {
                            color: 0x3338FF,
                            title: 'Scrim Info!',
                            fields: [{
                                name: 'Date',
                                value: q.data().DateOfScrim,
                                inline: true
                            }, {
                                name: 'Time',
                                value: q.data().TimeOfScrim,
                                inline: true
                            }, {
                                name: 'Rules',
                                value: q.data().Rules
                            }, {
                                name: 'Number of Players',
                                value: q.data().Players.length + '\\' + q.data().NumberOfPlayers,
                                inline: true
                            }, {
                                name: 'Number of Subs',
                                value: q.data().Subs.length + '\\' + q.data().NumberOfSubs,
                                inline: true
                            }, {
                                name: 'Players',
                                value: playersMsg
                            }, {
                                name: 'Subs',
                                value: subsMsg
                            }
                            ]
                        }
                    });
                }
            }
        });

}

module.exports.help = {
    name: 'info'
}