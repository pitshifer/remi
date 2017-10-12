const moment = require('moment');

const Task = function(msg, hours, minutes, text) {
    this.id = msg.message_id;
    this.chatId = msg.chat.id;
    this.hours = hours;
    this.minutes = minutes;
    this.message = msg.text;
    this.text = text;
    this.date = moment().set({
        hour: hours,
        minute: minutes
    });
};

exports.Task = Task;
