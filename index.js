const Config = require("./config.json"),
      TelegramBot = require("node-telegram-bot-api"),
      moment = require("moment"),
      Task = require("./models/task").Task,
      Chat = require("./models/chat").Chat,
      Repository = require("./repositoryMongo").Repository,
      bunyan = require("bunyan"),
      mongoose = require("mongoose");

const db = mongoose.createConnection('mongodb:/remi');
mongoose.Promise = global.Promise;

const logger = bunyan.createLogger({
    name: 'main',
    level: 'debug',
    streams: [
        {
            path: '/var/log/remi/app.log',
            level: 'warn'
        }
    ]
});

if (Config.debugMode) {
    logger.addStream({
        name: "DebugLogger",
        stream: process.stdout,
        level: 'debug'
    });
}

db.on('error', logger.error);

let tasks = new Repository('task', db, logger);
let chats = new Repository('chat', db, logger);

if (!Config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

const Remi = new TelegramBot(Config.botToken, {'polling': true});

const ChatRegister = (msg) => {
    chats.add(new Chat(msg), (err, model) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info({newChat: model}, 'Register new chat');
        }
    });
};

moment.locale('ru');


Remi.on('message', ChatRegister);

Remi.onText(/^([0-1]\d|2[0-3])[: ]([0-5]\d)(.+$)/, (msg, match) => {
    let chatId = msg.chat.id;
    let hours = match[1];
    let minutes = match[2];
    let text = match[3].trim();

    tasks.add(new Task(chatId, hours, minutes, text), function(err, newTask) {
        if (err) {
            logger.error(err);
            Remi.sendMessage(chatId, "Упс... не понял, что ты имеешь в виду.").catch(logger.error);
        } else {
            logger.info({newTask: newTask}, "Accepted new task");
            Remi.sendMessage(chatId, 'Ok, понял.').catch(logger.error);
        }
    });
});

Remi.on('message', (msg) => {
    if (msg.text && msg.text === '/users') {
        let message = 'Всего контактов: ' + users.count() + '\n';
        for (let user of users.getAll()) {
            message += user.id + ' ' + user.name + '\n';
        }

        Remi.sendMessage(msg.chat.id, message).catch(logger.error);
    }

    if (msg.text && msg.text === '/tasks') {
        let message = 'Всего задач: ' + tasks.count() + '\n';
        for (let task of tasks.getAll()) {
            message += task.id + ' - ' + ' ' + task.timestamp + ' ' + task.timestamp.format('LLLL') + ' - ' + task.message + '\n';
        }

        Remi.sendMessage(msg.chat.id, message).catch(logger.error);
    }

    if (msg.text && msg.text === '/chats') {
        chatModel.find((err, chats) => {
            if (err) {
                console.error(err);
            } else {
                console.log(chats);
                console.log("COUNT: ", chats.length);
            }
        });
    }
});
