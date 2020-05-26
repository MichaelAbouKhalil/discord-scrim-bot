module.exports.run = async (bot, message, args, db) => {

    //id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }


    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let teamA = q.data().TeamA;
            let teamB = q.data().TeamB;

            if (teamA.length == 0 || teamB.length == 0) {
                message.channel.send('Teams not created yet!');
                return;
            }

            let msg = 'The teams for today are as follows:\n\n';
            teamA.forEach(p => {
                msg += '<@' + p + '>\n';
            });
            msg += 'Vs.\n';
            teamB.forEach(p => {
                msg += '<@' + p + '>\n';
            });
            message.channel.send(msg);

        });
}

module.exports.help = {
    name: 'teams'
}