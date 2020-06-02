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

    let mentions = [];
    message.mentions.users.forEach(u => {
        let id = u.id;
        let username = u.username;

        // find player displayname
        message.guild.members.cache.forEach(m => {
            if (m.user.id === id) {
                username = m.displayName;
            }
        });
        mentions.push({
            id: id,
            username: username
        });
    });

    let alreadyBannedMessage = "These players are already banned: ";
    let testLength = alreadyBannedMessage.length;
    mentions = mentions.filter(m => {
        let found = false;
        bannedPlayers.forEach(b => {
            if (m.id === b.id) { 
                found = true; 
                alreadyBannedMessage +=  m.username + " ";
            }
        });
        return !found;
    });

    if(alreadyBannedMessage.length > testLength) {
        message.reply(alreadyBannedMessage);
    }

    if(mentions.length == 0){
        return;
    }

    let msgReply = '';
    let draft = "You've been banned from future scrims as you opted in to play but didn't use a mic. " +
        "Message <@658815505586716692> <@247038278535086080> if you're willing to use a mic next time and want to be unbanned.";
    mentions.forEach(m => {
        bannedPlayers.push(m); 
        msgReply += "<@" + m.id + ">\n";
    });
    msgReply += draft;

    // update db
    db.collection('guilds').doc(message.guild.id).update({
        'bannedPlayers': bannedPlayers
    }).then(() => {
        message.channel.send(msgReply);
    });
}

module.exports.help = {
    name: 'ban'
}