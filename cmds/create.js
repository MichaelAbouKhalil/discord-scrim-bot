module.exports.run = (bot, message, args, db, FieldValue, prefix) => {

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
                description: '\nHi everyone. Below you\'ll find the details of the upcoming internal scrim.\n' +
                'Everyone is allowed to get involved. Spots are limited and work on a first come first served basis.\n\n' +
                "I strongly recommend for new memebers to get involved and have some fun. This will be a way to show your skills to the others." +
                ' And don\'t worry if you perform badly. It\'s all about practising and improving at the end of the day. Enjoy!\n',
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
        message.channel.send('SCRIM REGISTRATION OPEN. CLAIM YOUR SPOT BEFORE IT\'S GONE!\n\n@everyone\n' +
            'type **' + prefix + 'in**: to play in main roster\n' +
            'type **' + prefix + 'sub**: to apply to subs roster\n' +
            'type **' + prefix + 'remove**: to remove your name\n' +
            'type **' + prefix + 'info**: to display scrim\'s information\n' +
            'type **' + prefix + 'rules**: to see the full list of rules we\'ll be playing by');


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