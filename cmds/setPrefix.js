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
    
    if(args.length === 0){
        message.channel.send("missing the prefix");
    }else if(args.length === 1){
        let nPrefix = args[0];

        db.collection('guilds').doc(message.guild.id).update({
            'prefix': nPrefix
        }).then(() => {
            message.channel.send(`[prefix update] : new prefix ${nPrefix}`);
        });
    }
}

module.exports.help = {
    name: 'setPrefix'
}