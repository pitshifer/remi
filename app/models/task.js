const moment = require('moment');
const repository = require("../repositoryMongo");

const Task = function(msg, chat, hours, minutes, text) {
    this.id = msg.message_id;
    this.chatId = msg.chat.id;
    this.hours = hours;
    this.minutes = minutes;
    this.message = msg.text;
    this.text = text;
    this.dateNotif = moment().utcOffset(chat.timezone).set({
        hour: hours,
        minute: minutes,
        seconds: 0
    }).utc().toDate();
};

exports.Task = Task;
