const Config = require("./config.json"),
      TelegramBot = require("node-telegram-bot-api"),
      moment = require("moment"),
      User = require("./models/user").User,
      Task = require("./models/task").Task,
      Repository = require("./repository").Repository;

if (!Config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

moment.locale('ru');
const Remi = new TelegramBot(Config.botToken, {'polling': true});
let users = new Repository();
let tasks = new Repository();

Remi.onText(/^([0-1]\d|2[0-3])[: ]([0-5]\d)(.+$)/, (msg, match) => {
    let chatId = msg.chat.id;
    let hours = match[1];
    let minutes = match[2];
    let text = match[3].trim();

    tasks.add(new Task(chatId, hours, minutes, text), function(err) {
        if (err) {
            console.error(err);
        } else {
            Remi.sendMessage(chatId, 'Ok, понял');
        }
    });
});

Remi.on('message', (msg) => {
    if (msg.text && msg.text === '/start') {
        console.info(msg);
        users.add(new User(msg), function(err) {
            if (err) {
                console.error(err);
            } else {
                Remi.sendMessage(msg.chat.id, 'Здоров, ' + msg.from.first_name);
            }
        });
    }

    if (msg.text && msg.text === '/users') {
        let message = 'Всего контактов: ' + users.count() + '\n';
        for (let user of users.getAll()) {
            message += user.id + ' ' + user.name + '\n';
        }

        Remi.sendMessage(msg.chat.id, message);
    }

    if (msg.text && msg.text === '/tasks') {
        let message = 'Всего задач: ' + tasks.count() + '\n';
        for (let task of tasks.getAll()) {
            message += task.id + ' - ' + ' ' + task.timestamp + ' ' + task.timestamp.format('LLLL') + ' - ' + task.message + '\n';
        }

        Remi.sendMessage(msg.chat.id, message);
    }
});