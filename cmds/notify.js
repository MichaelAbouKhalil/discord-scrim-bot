module.exports.run = async (bot, message, args, db) => {

    // role check
    const accessRoles = ['RoleA', 'RoleB'];
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
        message.channel.send('please use [focus help] to select a scrim or [create] to create a new one');
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