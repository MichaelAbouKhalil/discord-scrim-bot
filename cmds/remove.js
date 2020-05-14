module.exports.run = async (bot, message, args, db) => {

    // id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('please use [focus help] to select a scrim or [create] to create a new one');
        return;
    }

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

            const nPlayers = players.filter(e => e !== username);
            const nSubs = subs.filter(e => e !== username);
            const nPlayersIDs = playersIDs.filter(e => e !== userID);
            const nSubsIDs = subsIDS.filter(e => e !== userID);

           // update db
           db.collection('scrims').doc(q.id).update({
                'Subs': nSubs,
                'SubsID': nSubsIDs,
                'Players': nPlayers,
                'PlayersID': nPlayersIDs
            }).then(() =>{
                message.reply("you're no longer involved in the scrim");
            });
        })
    });
}

module.exports.help = {
    name: 'remove'
}