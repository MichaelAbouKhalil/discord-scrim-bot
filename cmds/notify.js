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

    if(args.length != 1){
        message.channel.send('Missing arguments!');
        return;
    }

    let playerMessage;
    let subMessage;

    if(args[0] === '1'){
        playerMessage = '\nDON\'T FORGET YOU\'RE SCRIMMING TODAY';
        subMessage = '\nDON\'T FORGET YOU\'RE ON THE SUB LIST';
    }else if(args[0] === '2'){
        playerMessage = '';
        subMessage = '\nSCRIM IS SOON. BE READY';
    }else if(args[0] === '3'){
        playerMessage = '\nGET ONLINE';
        subMessage = '\nSUBS STAY ON STANDBY';
    }else {
        message.channel.send('Wrong arguments!');
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
                pMsg += playerMessage;
                message.channel.send(pMsg);
            }

            sIds.forEach(s => {
                sMsg += '<@' + s + '> '
            });
            if(sIds != 0){
                sMsg += subMessage;
                message.channel.send(sMsg);
            }
            
        })
    });
}

module.exports.help = {
    name: 'notify'
}