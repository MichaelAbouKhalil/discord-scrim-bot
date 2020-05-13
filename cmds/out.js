module.exports.run = async (bot, message, args, db) => {

    let username = message.author.username;
    let userID = message.author.id;

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1)
    .get()
    .then(snapshot => {
        snapshot.forEach(q => {
            let playersIDs = q.data().PlayersID;
            let subsIDS = q.data().SubsID;
            
            let players = q.data().Players;
            let subs = q.data().Subs;
            
            if(!playersIDs.includes() && subsIDS.includes()){
                message.reply('you did not apply!');
                return
            }

            playersIDs = playersIDs.replace(', ' + userID, '');
            subsIDS = subsIDS.replace(', ' + userID, '');
            playersIDs = playersIDs.replace(userID, '');
            subsIDS = subsIDS.replace(userID, '');
            players = players.replace(', ' + username, '');
            subs = subs.replace(', ' + username, '');
            players = players.replace(username, '');
            subs = subs.replace(username, '');

           // update db
           db.collection('scrims').doc(q.id).update({
                'Subs': subs,
                'SubsID': subsIDS,
                'Players': players,
                'PlayersID': playersIDs
            }).then(() =>{
                message.reply('you are out!');
            });
        })
    });
}

module.exports.help = {
    name: 'out'
}