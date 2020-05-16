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

    let reply = 'Hi ' + message.author.username + ', below are the IDs of the last 5 scrims created (ordered by newest to oldest), please use the **bold value**: \n';

    if (args[0] === 'help') {
        // send last 5 created scrims to author
        db.collection('scrims')
            .orderBy('TimeStamp', 'desc').limit(5)
            .get()
            .then(snapshot => {
                snapshot.forEach(q => {
                    let scrim = q.data();
                    let availablePlayers = scrim.Players.length;
                    let availableSubs = scrim.Subs.length;

                    reply += '**' + q.id + '**:\t\t ' + scrim.DateOfScrim + ' ' + scrim.TimeOfScrim + ' ' + scrim.Rules + ' ' + availablePlayers + '\\'
                        + scrim.NumberOfPlayers + ' ' + scrim.state + '\n';
                });
            }).then(() => {
                message.author.send(reply);
            });
    } else if (args[0]) {
        // search for provided id 
        db.collection('scrims').doc(args[0]).get()
            .then(q => {
                if (q.exists) {
                    // update if id exists
                    focusedID = q.id;
                    message.channel.send('Scrim selected');
                } else {
                    // send error if id don't exists
                    message.channel.send('no scrim with this ID available please use [focus help]');
                }
            })
    }else{
        // arguments check
        message.channel.send('Missing argument, please use [focus help] or [focus <ID>]');
        return;
    }

}

module.exports.help = {
    name: 'focus'
}