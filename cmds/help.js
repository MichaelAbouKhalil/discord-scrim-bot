
module.exports.run = async (bot, message, args, db) => {

    db.collections('guilds').doc(message.guild.id).get().then(q => {
        if (q.exists) {
            let prefix = q.data().prefix;
            message.channel.send({
                embed: {
                    color: 0x00B831,
                    title: 'Bot Commands!',
                    fields: [{
                        name: prefix + 'setPrefix',
                        value: 'Change the bot prefix'
                    }, {
                        name: prefix + 'create',
                        value: 'Create a new scrim with the following format: <date> <time> <timezone> <# of players> <# of subs> <scrim rules> \n example: 12/05/2020 7:30 IST 10 5 rank'
                    }, {
                        name: prefix + 'info',
                        value: "Displays scrim's info"
                    }, {
                        name: prefix + 'open',
                        value: 'Open scrim for registration'
                    }, {
                        name: prefix + 'close',
                        value: 'Close scrim registrations'
                    }, {
                        name: prefix + 'in',
                        value: 'Apply to play in the main scrim roster'
                    }, {
                        name: prefix + 'sub',
                        value: 'Apply to the sub roster'
                    }, {
                        name: prefix + 'remove',
                        value: 'Remove your name from rosters'
                    }, {
                        name: prefix + 'notify',
                        value: 'Notify rosters to get ready for scrim'
                    }, {
                        name: prefix + 'rules',
                        value: 'Displays the rules to follow'
                    }, {
                        name: prefix + 'focus',
                        value: 'Select a specific Scrim'
                    }, {
                        name: prefix + 'help',
                        value: 'Display bot commands'
                    }
                    ]
                }
            })
        }
    });

}

module.exports.help = {
    name: 'help'
}