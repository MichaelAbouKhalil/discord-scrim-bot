module.exports.run = async (bot, message, args, db) => {

    // role check
    const accessRoles = ['Scrim Manager'];
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
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let scrim = q.data();

            // update db
            db.collection('scrims').doc(q.id).update({
                'state': 'open'
            }).then(() => {
                message.channel.send('Scrim registration open! @everyone');
            });
        });
}

module.exports.help = {
    name: 'open'
}