const Chat = function(data) {
    this.id = data.chat.id;
    this.type = data.chat.type;
    this.firstName = data.chat.first_name;
    this.lastName = data.chat.last_name;
    this.timezone = 0;
};

exports.Chat = Chat;
