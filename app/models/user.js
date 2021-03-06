const _ = require('lodash');

const User = function(message) {
    this.id = _.uniqueId();
    this.userId = message.from.id;
    this.chatId = message.chat.id;
    this.firstName = message.from.first_name;
    this.lastName = message.from.last_name;
    this.name = this.firstName + ' ' + this.lastName;
};

exports.User = User;
