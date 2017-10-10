const Chat = function(data) {
    this.id = data.chat.id;
    this.type = data.chat.type;
    this.firstName = data.chat.first_name;
    this.lastName = data.chat.last_name;
};

exports.Chat = Chat;
