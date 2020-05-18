module.exports.run = async (bot, db) => {

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1).get()
    .then(snapshot => {
        snapshot.forEach(q => {
           focusedID = q.id;
        })
        console.log('auto focusID= ' + focusedID);
    });

}

module.exports.help = {
    name: 'autofocus'
}