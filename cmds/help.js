
module.exports.run = async (bot, message, args, db) => {

    let fields = [];
    db.collection('commands').doc('default').get().then(q => {

        if (q.exists) {
            let commands = q.data().commands;

            db.collection('guilds').doc(message.guild.id).get().then(p => {
                if (p.exists) {
                    let prefix = p.data().prefix;

                    for (const [key, value] of Object.entries(commands)) {
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