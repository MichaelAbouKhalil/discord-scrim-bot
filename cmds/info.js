module.exports.run = (bot, message, args, db) => {

    // id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let players = '';
            let subs = '';

            // if(q.data().Subs.length != 0){
            //     q.data().Subs.forEach(q => {
            //         subs += q + ' ';
            //     });
            // }

            // if(q.data().Players.length != 0){
            //     q.data().Players.forEach(q => {
            //         players += q + ' ';
            //     });
            // }

            players = players === '' ? 'None' : players;
            subs = subs === '' ? 'None' : subs;

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
                        value: q.data().Players.length == 0 ? 'NONE' : q.data().Players
                    }, {
                        name: 'Subs',
                        value: q.data().Subs.length == 0 ? 'NONE' : q.data().Subs
                    }
                    ]
                }
            });
        });
}

module.exports.help = {
    name: 'info'
}