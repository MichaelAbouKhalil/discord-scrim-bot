module.exports.run = async (bot, message, args, db) => {

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1)
    .get()
    .then(snapshot => {
        snapshot.forEach(q =>{
            let scrim = q.data();

            // update db
            db.collection('scrims').doc(q.id).update({
                'state': 'open'
            }).then(() =>{
                message.channel.send('Scrim registration open! @everyone');
            });
        })
    });
}

module.exports.help = {
    name: 'open'
}