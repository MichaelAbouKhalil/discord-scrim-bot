module.exports.run = (bot, message, args, db, FieldValue, prefix) => {

    // role check
    const accessRoles = ['RoleA', 'RoleB'];
    let canAccess = false;
    if (message.member.roles.cache.some(r => accessRoles.includes(r.name))) {
        canAccess = true;
    }
    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    // arguments check
    if ((args.length != 6)) {
        message.reply("missing arguments!");
        return;
    }

    let date = args[0];
    let time = args[1] + ' ' + args[2];
    let numbPlayers = args[3];
    let numbSubs = args[4];
    let rules = args[5];

    // add to db
    db.collection('scrims').add({
        'DateTimeCreated': new Date(),
        'DateOfScrim': date,
        'TimeOfScrim': time,
        'NumberOfPlayers': numbPlayers,
        'NumberOfSubs': numbSubs,
        'Rules': rules,
        'Players': [],
        'PlayersID': [],
        'Subs': [],
        'SubsID': [],
        'TimeStamp': FieldValue.serverTimestamp(),
        'state': 'open'
    }).then(() => {
        message.channel.send({
            embed: {
                color: 0x3338FF,
                title: 'Scrim Info!',
                fields: [{
                    name: 'Date',
                    value: date,
                    inline: true
                }, {
                    name: 'Time',
                    value: time,
                    inline: true
                }, {
                    name: 'Rules',
                    value: rules
                }, {
                    name: 'Number of Players',
                    value: numbPlayers,
                    inline: true
                }, {
                    name: 'Number of Subs',
                    value: numbSubs,
                    inline: true
                }
                ],
            }
        });
        message.channel.send('Scrim registration open! @everyone\n' +
            'type **' + prefix + 'in**: \tto play in main roster\n' +
            'type **' + prefix + 'sub**: \tto apply to subs roster\n' +
            'type **' + prefix + 'remove**: \tto remove your name');


        // set global variable focusedID ( scrim id)
        db.collection('scrims')
            .orderBy('TimeStamp', 'desc').limit(1)
            .get()
            .then(snapshot => {
                snapshot.forEach(q => {
                    focusedID = q.id;
                })
            });
    });
}

module.exports.help = {
    name: 'create'
}