const Config = require("./config.json"),
    TelegramBot = require("node-telegram-bot-api"),
    User = require("./user").User,
    RepoUser = require("./repoUser").Repository;

if (!Config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

const Remi = new TelegramBot(Config.botToken, {'polling': true});
let users = new RepoUser();

Remi.onText(/([0-1]\d|2[0-3])[: ]([0-5]\d)/, (msg, match) => {
    let chatId = msg.chat.id;
    let hours = match[1];
    let minutes = match[3];

    console.log(match);

    Remi.sendMessage(chatId, hours + 'hour ' + minutes + 'min - this is time');
});

Remi.on('message', (msg) => {
    if (msg.text && msg.text === '/start') {
        users.add(new User(msg), function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('New user come in chat');
            }
        });
    }

    if (msg.text && msg.text === '/users') {
        let message = '';

        message += 'Всего контактов: ' + users.count() + '\n';
        for (let user of users.getAll()) {
            message += user.id + ' ' + user.name + '\n';
        }

        Remi.sendMessage(msg.chat.id, message);
    }
});