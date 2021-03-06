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

    if (args.length != 1) {
        message.channel.send('Missing arguments!');
        return;
    }

    let playerMessage;
    let subMessage;

    if (args[0] === '1') {
        playerMessage = '\nDON\'T FORGET YOU\'RE SCRIMMING TODAY';
        subMessage = '\nDON\'T FORGET YOU\'RE ON THE SUB LIST';
    } else if (args[0] === '2') {
        playerMessage = '';
        subMessage = '\nSCRIM IS SOON. BE READY';
    } else if (args[0] === '3') {
        playerMessage = '\nGET ONLINE';
        subMessage = '\nSUBS STAY ON STANDBY';
    } else {
        message.channel.send('Wrong arguments!');
        return;
    }

    db.collection('scrims')
        .orderBy('TimeStamp', 'desc').limit(1)
        .get()
        .then(snapshot => {
            snapshot.forEach(q => {
                let emptyPlayers = q.data().Players.length == 0;
                let emptySubs = q.data().Subs.length == 0;
                let players = q.data().Players;
                let subs = q.data().Subs;

                let pMsg = '';
                let sMsg = '';

                players.forEach(p => {
                    pMsg += '<@' + p.id + '> '
                });
                subs.forEach(s => {
                    sMsg += '<@' + s.id + '> '
                });

                let reply = '';

                if (!emptyPlayers) {
                    reply += pMsg + playerMessage + '\n';
                }
                if (!emptySubs) {
                    reply += sMsg + subMessage;
                }

                if (emptySubs && args[0] === '2') {
                    reply += subMessage;
                }

                if (emptyPlayers && emptySubs) {
                    reply += 'No players available yet!';
                }

                message.channel.send(reply);

            })
        });
}

module.exports.help = {
    name: 'notify'
}