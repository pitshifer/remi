const config = require("./config.json");
const TelegramBot = require("node-telegram-bot-api");

if (!config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

let Remi = new TelegramBot(config.botToken, {'polling': true});

Remi.onText(/\/echo (.+)/, (msg, match) => {
    let chatId = msg.chat.id;
    let response = match[1];

    Remi.sendMessage(chatId, response);
});

Remi.on('message', function(msg) {
    let chatId = msg.chat.id;

    Remi.sendMessage(chatId, 'Yo!');
});

