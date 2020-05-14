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
        snapshot.forEach(q =>{
            let scrim = q.data();

            // update db
            db.collection('scrims').doc(q.id).update({
                'state': 'open'
            }).then(() =>{
                message.channel.send('Scrim registration open! @everyone');
            });
        })
    });
}

module.exports.help = {
    name: 'open'
}