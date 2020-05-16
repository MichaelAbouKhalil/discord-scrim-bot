module.exports.run = async (bot, message, args, db) => {

    // role check
    const accessRoles = ['Scrim Manager'];
    let canAccess = false;
    if (message.member.roles.cache.some(r=>accessRoles.includes(r.name))){
        canAccess = true;
    }
    if(!canAccess){
        message.reply("you can't use this command!");
        return;
    }

    // id check
    if(typeof focusedID === 'undefined'){
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    db.collection('scrims')
    .orderBy('TimeStamp', 'desc').limit(1)
    .get()
    .then(snapshot => {
        snapshot.forEach(q => {
            let pIds = q.data().PlayersID;
            let sIds = q.data().SubsID;

            let pMsg = '';
            let sMsg = '';

            pIds.forEach(p => {
                pMsg += '<@' + p + '> '
            });
            if(pIds != 0){
                pMsg += '\nGET READY TO SCRIM!';
                message.channel.send(pMsg);
            }

            sIds.forEach(s => {
                sMsg += '<@' + s + '> '
            });
            if(sIds != 0){
                sMsg += '\nSUBS STAY ON STANDBY';
                message.channel.send(sMsg);
            }
            
        })
    });
}

module.exports.help = {
    name: 'notify'
}