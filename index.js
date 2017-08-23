const Config = require("./config.json");
const TelegramBot = require("node-telegram-bot-api");
const User = require("./user").User;
const _ = require('lodash');

if (!Config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

const Remi = new TelegramBot(Config.botToken, {'polling': true});
let users = [];

Remi.onText(/\/echo (.+)/, (msg, match) => {
    let chatId = msg.chat.id;
    let response = match[1];

    Remi.sendMessage(chatId, response + ' - this is echo');
    console.log(msg);
});

Remi.on('message', (msg) => {
    if (msg.text && msg.text === '/start') {
        let existUser = _.find(users, function(u) {
            return u.id === msg.from.id;
        });

        if (!existUser) {
            users.push(new User(msg.from.id, msg.from.first_name, msg.from.last_name));
            console.log('New user come in chat');
        }
    }

    if (msg.text && msg.text === '/users') {
        let message = '', i;

        message += 'Всего контактов: ' + users.length + '\n';
        for (i in users) {
            message += users[i].id + ' ' + users[i].name + '\n';
        }

        Remi.sendMessage(msg.chat.id, message);
    }

    console.log(msg);
});