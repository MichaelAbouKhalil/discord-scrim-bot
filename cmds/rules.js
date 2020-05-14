
module.exports.run = async (bot, message, args, db) => {

    if(typeof focusedID === 'undefined'){
        message.channel.send('please ask your scrim manager to create/select a scrim');
        return;
    }

    let rulesMsg = '';
    db.collection('scrims')
        .doc(focusedID)
        .get()
        .then(q => {
            let rulesType = q.data().Rules;
            if(rulesType.toLowerCase() === 'ranked'){
                rulesMsg = '**Everything allowed!**'
                message.channel.send(rulesMsg);
            }else if(rulesType.toLowerCase() === 'scrim'){
                db.collection('rules').doc('scrim-rules').get().then(r => {
                    rulesMsg = r.data().rules;
                    message.channel.send(rulesMsg);
                })
            }else{
                rulesMsg = 'Rules type unknown!'
                message.channel.send(rulesMsg);
            }

        })

}

module.exports.help = {
    name: 'rules'
}