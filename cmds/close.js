module.exports.run = async (bot, message, args, db) => {

    // role check
    const accessRoles = ['RoleA', 'RoleB'];
    let canAccess = false;
    if (message.member.roles.cache.some(r => accessRoles.includes(r.name))) {
        canAccess = true;
    }
    if (!canAccess) {
        message.reply("you can't use this command!");
        return;
    }

    // id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('please use [focus help] to select a scrim or [create] to create a new one');
        return;
    }

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();

            // update db
            db.collection('scrims').doc(q.id).update({
                'state': 'close'
            }).then(() => {
                message.channel.send('Scrim registration closed!');
            });
        });
}

module.exports.help = {
    name: 'close'
}