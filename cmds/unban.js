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

    let notBannedMessage = "These players are not banned: ";
    let testLength = notBannedMessage.length;
    mentions = mentions.filter(m => {
        let found = false;
        bannedPlayers.forEach(b => {
            if (m.id === b.id) { 
                found = true; 
            }
        });
        
        if(!found){
            notBannedMessage +=  m.username + " ";
        }
        return found;
    });

    if(notBannedMessage.length > testLength) {
        message.reply(notBannedMessage);
    }

    if(mentions.length == 0){
        return;
    }

    let msgReply = '';
    let draft = "You're now allowed to opt in for future scrims. Please opt in only if you're going to use a mic.";
    mentions.forEach(m => {
        bannedPlayers = bannedPlayers.filter(b => !(b.id === m.id));
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
    name: 'unban'
}