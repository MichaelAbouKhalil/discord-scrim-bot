module.exports.run = (bot, message, args, db) => {

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1)
    .get()
    .then(snapshot => {
        snapshot.forEach(q =>{
            let players = (q.data().Players.length === 0) ? "None" : q.data().Players;
            let subs = (q.data().Subs.length === 0) ? "None" : q.data().Subs;
            message.channel.send({embed:{
                color: 0x3338FF,
                title: 'Scrim Info!',
                fields: [{
                    name: 'Date',
                    value: q.data().DateOfScrim,
                    inline: true
                },{
                    name: 'Time',
                    value: q.data().TimeOfScrim,
                    inline: true
                },{
                    name: 'Rules',
                    value: q.data().Rules
                },{
                    name: 'Number of Players',
                    value: q.data().NumberOfPlayers,
                    inline: true
                },{
                    name: 'Number of Subs',
                    value: q.data().NumberOfSubs,
                    inline: true
                },{
                    name: 'Players',
                    value: players
                },{
                    name: 'Subs',
                    value: subs
                }
            ]
        }  
            });
        });
    })
    .catch(err => {
        message.channel.send('No Scrims Scheduled');
    })
}

module.exports.help = {
    name: 'info'
}