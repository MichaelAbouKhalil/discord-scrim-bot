module.exports.run = async (bot, message, args, db) => {

    //id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let username = message.author.username;
    let userID = message.author.id;

    message.guild.members.cache.forEach(m => {
        if(m.user.id === userID){
            username = m.displayName;
        }
    });

    db.collection('scrims')
    .doc(focusedID)
    .get()
    .then(q => {
            let scrim = q.data();

            // check scrim status
            if(scrim.state === 'close'){
                message.channel.send('Scrim registration closed');
                return;
            }
            if(scrim.state === 'cancelled'){
                message.channel.send('Scrim registration cancelled');
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
            if(scrim.NumberOfPlayers == players.length){
                message.reply('Scrim mains is full!');
                return;
            }
            
            players.push(username);
            ids.push(userID);

            // update db
            db.collection('scrims').doc(q.id).update({
                'Players': players,
                'PlayersID': ids
            }).then(() =>{
                message.reply("you've been put down to play scrim");
            });
    });

}

module.exports.help = {
    name: 'in'
}