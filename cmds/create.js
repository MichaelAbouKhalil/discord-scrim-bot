module.exports.run = (bot, message, args, db, FieldValue) => {

    if((args.length != 6)) {
        message.reply("missing arguments!");
        return;
    }

    let date = args[0];
    let time = args[1] + ' ' + args[2];
    let numbPlayers = args[3];
    let numbSubs = args[4];
    let rules = args[5];

    db.collection('scrims').add({
        'DateTimeCreated': new Date(),
        'DateOfScrim': date,
        'TimeOfScrim': time,
        'NumberOfPlayers': numbPlayers,
        'NumberOfSubs': numbSubs,
        'Rules': rules,
        'Players': '',
        'PlayersID': '',
        'Subs': '',
        'SubsID': '',
        'TimeStamp': FieldValue.serverTimestamp(),
        'state': 'open'
    }).then(() => {
        message.channel.send({embed:{
            color: 0x3338FF,
            title: 'Scrim Info!',
            fields: [{
                name: 'Date',
                value: date,
                inline: true
            },{
                name: 'Time',
                value: time,
                inline: true
            },{
                name: 'Rules',
                value: rules
            },{
                name: 'Number of Players',
                value: numbPlayers,
                inline: true
            },{
                name: 'Number of Subs',
                value: numbSubs,
                inline: true
            }
        ],
        footer: {
            text: 'to apply please type !apply'
        }
        }
        });
        message.channel.send('Scrim registration open! @everyone');
    });
}

module.exports.help = {
    name: 'create'
}