module.exports.run = async (bot, message, args, db) => {

    let username = message.author.username;
    let userID = message.author.id;

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1)
    .get()
    .then(snapshot => {
        snapshot.forEach(q => {
            let scrim = q.data();

            if(scrim.state === 'close'){
                message.channel.send('Scrim registration closed');
                return;
            }

            let players = scrim.Players;
            let subs = scrim.Subs;
            let ids = scrim.PlayersID;
            let subsIds = scrim.SubsID;

            // if user already applied => ignore
            if(ids.includes(userID)) {
                message.reply('already applied for main!');
                return;
            }

            // if user already applied => ignore
            if(subsIds.includes(userID)) {
                message.reply('already applied for subs!');
                return;
            }

            // if number of player is maxed => ignore
            var arr = players.split(",").map(item => item.trim());
            if(scrim.NumberOfPlayers < arr.length + 1){
                message.reply('Scrim mains is full!');
                return;
            }
            
            if(arr == 0){
                players = username;
                ids = userID;
            }else{
                players += ', ' + username;
                ids += ', ' + userID;
            }
            
            // update db
            db.collection('scrims').doc(q.id).update({
                'Players': players,
                'PlayersID': ids
            }).then(() =>{
                message.channel.send('<@'+userID + '> applied for main!');
            });
        });
    });

}

module.exports.help = {
    name: 'play'
}