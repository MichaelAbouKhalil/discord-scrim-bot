
module.exports.run = async (bot, message, args, db) => {

    let managerhelp = false;

    if(args.length === 1 && args[0] === 'm'){
        managerhelp = true;
    }

    let fields = [];
    db.collection('commands').doc('default').get().then(q => {

        if (q.exists) {
            let commands = Object.entries(q.data().commands);

            if(managerhelp){
                commands = commands.filter(e => e[0].includes('Scrim Manager'));
            }else{
                commands = commands.filter(e => !e[0].includes('Scrim Manager'));
            }

            db.collection('guilds').doc(message.guild.id).get().then(p => {
                if (p.exists) {
                    let prefix = p.data().prefix;

                    for (const [key, value] of commands) {
                        let obj = {
                            name: prefix + key,
                            value: value
                        }
                        fields.push(obj);
                    }

                    message.channel.send({
                        embed: {
                            color: 0x00B831,
                            title: 'Bot Commands!',
                            fields: fields
                        }
                    });
                }
            })
        }
    });
}

module.exports.help = {
    name: 'help'
}