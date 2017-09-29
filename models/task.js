const _ = require('lodash');
const moment = require('moment');

const Task = function(chatId, hours, minutes, msg) {
    this.id = _.uniqueId();
    this.chatId = chatId;
    this.hours = hours;
    this.minutes = minutes;
    this.message = msg;
    this.timestamp = moment().set({
        hour: hours,
        minute: minutes
    });
};

exports.Task = Task;
