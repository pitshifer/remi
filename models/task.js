const _ = require('lodash');

const Task = function(chatId, hours, minutes, msg) {
    this.id = _.uniqueId('task_');
    this.chatId = chatId;
    this.hours = hours;
    this.minutes = minutes;
    this.message = msg;
};

exports.Task = Task;
