module.exports.run = async (bot, message, args, db) => {

    const roles = ['RoleA', 'RoleB'];
    let canAccess = false;

    if (message.member.roles.some(role => roles.includes(role.name))){
        canAccess = true;
    }

    if(!canAccess){
        message.reply("you can't use this command");
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
                'state': 'close'
            }).then(() =>{
                message.channel.send('Scrim registration closed!');
            });
        })
    });
}

module.exports.help = {
    name: 'close'
}