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
            let players = q.data().Players;
            let subs = q.data().Subs;
            let exit = false;
            if (players.length % 2 != 0) {
                message.channel.send('Number of players is odd');
                exit = true;
            }

            if (!exit) {
                // randomize array
                shuffle(players);
                let halfwayThrough = Math.floor(players.length / 2)

                // split array in 2
                let teamA = players.slice(0, halfwayThrough);
                let teamB = players.slice(halfwayThrough, players.length);

                // update db
                db.collection('scrims')
                    .doc(focusedID)
                    .update({
                        'TeamA': teamA,
                        'TeamB': teamB
                    }).then(() => {
                        let msg = 'The teams for today are as follows:\n\n';
                        teamA.forEach(p => {
                            msg += '<@' + p.id + '>\n';
                        });
                        msg += '\nVs.\n\n';
                        teamB.forEach(p => {
                            msg += '<@' + p.id + '>\n';
                        });
                        if (subs.length != 0) {
                            msg += '\n\nSubs:\n\n';
                            subs.forEach(s => {
                                msg += '<@' + s.id + '>\n';
                            })
                        }
                        message.channel.send(msg);
                    });
            }
        });
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

module.exports.help = {
    name: 'createteams'
}