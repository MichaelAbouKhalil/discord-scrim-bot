module.exports.run = async (bot, message, args, db) => {

    const roles = ['RoleA', 'RoleB'];
    let canAccess = false;

    if (message.member.roles.cache.some(r=>roles.includes(r.name))){
        canAccess = true;
    }

    if(!canAccess){
        message.reply("you can't use this command!");
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