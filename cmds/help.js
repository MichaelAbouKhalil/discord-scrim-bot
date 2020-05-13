
module.exports.run = async (bot, message, args, db) => {

            message.channel.send({embed:{
                color: 0x00B831,
                title: 'Bot Commands!',
                fields: [{
                    name: 'setPrefix',
                    value: 'Change the bot prefix'
                },{
                    name: 'create',
                    value: 'Create a new scrim with the following format: <date> <time> <timezone> <# of players> <# of subs> <scrim rules> \n example: 12/05/2020 7:30 IST 10 5 rank'
                },{
                    name: 'info',
                    value: "Displays scrim's info"
                },{
                    name: 'open',
                    value: 'Open scrim for registration'
                },{
                    name: 'close',
                    value: 'Close scrim registrations'
                },{
                    name: 'play',
                    value: 'Apply to play in the main scrim roster'
                },{
                    name: 'sub',
                    value: 'Apply to the sub roster'
                },{
                    name: 'out',
                    value: 'Remove your name from rosters'
                },{
                    name: 'notify',
                    value: 'Notify rosters to get ready for scrim'
                },{
                    name: 'help',
                    value: 'Display bot commands'
                }
            ]
        }  
    });

}

module.exports.help = {
    name: 'help'
}