module.exports.run = (bot, message, args, db, prefix, moment) => {

    let title = '';
    for(let i =1 ;i < args.length; i++){
        title += args[i] + ' ';
    }
    title += ':\n';
    let date = moment.utc(args[0]);
    let now = moment.utc().set('second', 0);
    if (now.isSame(date) || now.isAfter(date)) {
        message.channel.send('Countdown Finished!');
        return;
    }

    let diff = moment.preciseDiff(date, now, true);

    message.channel.send(displayMessage(title, diff))
        .then(sent => {
            sent.pin();
            let countdown = setInterval(() => {
                if (sent.reactions.cache.keyArray().includes('❌')) {
                    sent.edit(title + 'Countdown Stopped!');
                    sent.unpin();
                    clearInterval(countdown);
                    return;
                }
                now = moment.utc().set('second', 0);
                if (now.isSame(date) || now.isAfter(date)) {
                    sent.edit( title + 'Countdown Finished!');
                    sent.unpin();
                    clearInterval(countdown);
                    return;
                }
                diff = moment.preciseDiff(date, now, true);

                sent.edit(displayMessage(title, diff));
            }, 5 * 1000);
        });
}

function displayMessage(title, diff){
    let msg = title;
    if(diff.years > 0) msg += diff.years + (diff.years > 1 ? ' years ' : ' year ');
    if(diff.months > 0) msg += diff.months + (diff.months > 1 ? ' months ' : ' month ');
    if(diff.days > 0) msg += diff.days + (diff.days > 1 ? ' days ' : 'day ');
    if(diff.hours > 0) msg += diff.hours + (diff.hours > 1 ? ' hours ' : ' hour ');
    if(diff.minutes > 0) msg += diff.minutes + (diff.minutes > 1 ? ' minutes ' : ' minute ');
    if(msg === title){
        if(diff.seconds > 0 ) msg += '< 1 minute ';
    }

    return msg + 'remaining.';
}

module.exports.help = {
    name: 'countdown'
}