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
            let players = q.data().PlayersID;
            let subs = q.data().SubsID;
            let pIds = players.split(",").map(item => item.trim());
            let sIds = subs.split(",").map(item => item.trim());

            let pMsg = '';
            let sMsg = '';

            pIds.forEach(p => {
                pMsg += '<@' + p + '> '
            });
            if(pIds != 0){
                pMsg += '\nGET READY!!';
                message.channel.send(pMsg);
            }

            sIds.forEach(s => {
                sMsg += '<@' + s + '> '
            });
            if(sIds != 0){
                sMsg += '\nSTAY ON STANDBY!!';
                message.channel.send(sMsg);
            }
            
        })
    });
}

module.exports.help = {
    name: 'notify'
}