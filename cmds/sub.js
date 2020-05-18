module.exports.run = async (bot, message, args, db) => {

    // id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let username = message.author.username;
    let userID = message.author.id;

    db.collection('scrims')
    .doc(focusedID)
    .get()
    .then(q => {
            let scrim = q.data();

            // checking scrim status
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
            if(scrim.NumberOfSubs == subs.length){
                message.reply('Scrim subs is full!');
                return;
            }
            
            subs.push(username);
            subsIds.push(userID);
            
            // update db
            db.collection('scrims').doc(q.id).update({
                'Subs': subs,
                'SubsID': subsIds
            }).then(() =>{
                message.channel.send('<@' + userID + '> you\'ve been put down as a sub');
            });
    });
}

module.exports.help = {
    name: 'sub'
}