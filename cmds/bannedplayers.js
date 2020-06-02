module.exports.run = async (bot, message, args, db, FieldValue, prefix, bannedPlayers) => {

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

    let msgReply = "The players currently banned from future scrims are as follows:\n\n";
    let testLength = msgReply.length;
    bannedPlayers.forEach(b => {
        msgReply += b.username + "\n";
    });

    if(msgReply.length === testLength){
        msgReply = "No banned players."
    }

    message.channel.send(msgReply);
}

module.exports.help = {
    name: 'bannedplayers'
}