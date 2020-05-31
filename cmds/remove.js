module.exports.run = async (bot, message, args, db) => {

    // id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let username = message.author.username;
    let userID = message.author.id;

    message.guild.members.cache.forEach(m => {
        if (m.user.id === userID) {
            username = m.displayName;
        }
    });

    db.collection('scrims')
    .doc(focusedID)
    .get()
    .then(q => {
            let playersIDs = q.data().PlayersID;
            let subsIDS = q.data().SubsID;
            
            let players = q.data().Players;
            let subs = q.data().Subs;
            
            if(!playersIDs.includes(userID) && !subsIDS.includes(userID)){
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
    });
}

module.exports.help = {
    name: 'remove'
}