
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

    // arguments check
    if (args.length != 2) {
        message.channel.send('incorrect number of arguments');
        return;
    }

    let nTime = args[0] + ' ' + args[1];
    db.collection('scrims')
        .doc(focusedID)
        .update({
            'TimeOfScrim': nTime
        })
        .then(() => {
            message.channel.send('Time updated');
        });

}

module.exports.help = {
    name: 'updatetime'
}