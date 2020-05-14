module.exports.run = async (bot, message, args, db) => {

    const roles = ['RoleA', 'RoleB'];
    let canAccess = false;

    if (message.member.roles.cache.some(r => roles.includes(r.name))) {
        canAccess = true;
    }

    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    let reply = '';

    if (args[0] === 'help') {
        db.collection('scrims')
            .orderBy('TimeStamp', 'desc').limit(5)
            .get()
            .then(snapshot => {
                snapshot.forEach(q => {
                    let scrim = q.data();
                    let availablePlayers = scrim.Players.length;
                    let availableSubs = scrim.Subs.length;

                    reply += q.id + ':\t\t ' + scrim.DateOfScrim + ' ' + scrim.TimeOfScrim + ' ' + scrim.rules + ' ' + availablePlayers + '\\'
                        + scrim.NumberOfPlayers + ' ' + scrim.state + '\n';
                });
            }).then(() => {
                message.author.send(reply);
            });
    } else if (args[0]) {
        db.collection('scrims').doc(args[0]).get()
            .then(q => {
                if (q.exists) {
                    focusedID = q.id;
                    message.channel.send('Scrim selected');
                } else {
                    message.channel.send('no scrim with this ID available please use [focus help]');
                }
            })
    }else{
        message.channel.send('Missing argument, please use [focus help] or [focus <ID>]');
        return;
    }

}

module.exports.help = {
    name: 'focus'
}