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

    if (args.length > 5) {
        message.channel.send('Teams can\'t exceed 5 players');
        return;
    }

    let mentions = [];
    message.mentions.users.forEach(u => {
        mentions.push({
            id: u.id,
            username: u.username
        });
    });

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();
            let teamA = scrim.TeamA;
            let teamB = [];
            let players = scrim.Players;

            let found = false;

            mentions.forEach(m => {
                if (teamA.includes(m.id)) {
                    message.channel.send('<@' + m.id + '> is already in another team!');
                    found = true;
                }
            });

            if(found){
                return;
            }

            mentions.forEach(m => {
                teamB.push(m.id);
            });

            let teamMessage = 'Team B: ';
            mentions.forEach(m => {
                teamMessage += '\n<@' + m.id + '>';
            });
            teamMessage += '\nCreated successfully!'

            db.collection('scrims')
                .doc(focusedID)
                .update({
                    'TeamB': teamB
                }).then(() => {
                    message.channel.send(teamMessage);
                });
        });
}

module.exports.help = {
    name: 'teamb'
}