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

    //id check
    if (typeof focusedID === 'undefined') {
        message.channel.send('No scrims planned currently. Please ask your scrim manager to create/select a scrim.');
        return;
    }

    let empty = new Array();
    db.collection('scrims')
        .doc(focusedID)
        .update({
            'TeamA': empty,
            'TeamB': empty
        }).then(q => {
            message.channel.send('Teams cleared.');
        });
}

module.exports.help = {
    name: 'clearteams'
}