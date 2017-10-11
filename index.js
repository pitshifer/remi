const config = require("./remi.json"),
      TelegramBot = require("node-telegram-bot-api"),
      moment = require("moment"),
      Task = require("./models/task").Task,
      Chat = require("./models/chat").Chat,
      Repository = require("./repositoryMongo").Repository,
      logger = require("./logger").Logger('main', config),
      mongoose = require("mongoose");

if (!config.botToken) {
    console.error("Token for telegram bot is required.");
    process.exit(1);
}

const db = mongoose.createConnection('mongodb:/remi');
db.on('error', logger.error);
mongoose.Promise = global.Promise;
moment.locale('ru');

let tasks = new Repository('task', db, logger);
let chats = new Repository('chat', db, logger);
const Remi = new TelegramBot(config.botToken, {'polling': true});

const ChatRegister = (msg) => {
    chats.add(new Chat(msg), (err, model) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info({newChat: model}, 'Register new chat');
        }
    });
};

Remi.on('message', ChatRegister);

Remi.onText(/^([0-1]\d|2[0-3])[: ]([0-5]\d)(.+$)/, (msg, match) => {
    let chatId = msg.chat.id;
    let hours = match[1];
    let minutes = match[2];
    let text = match[3].trim();

    tasks.add(new Task(msg, hours, minutes, text), function(err, newTask) {
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
    if (msg.text && msg.text === '/tasks') {
        tasks.getAll((err, tasks) => {
            if (err) {
                logger.error(err);
            } else {
                let message = 'Всего задач: ' + tasks.length + '\n';
                for (let task of tasks) {
                    // message += task.id + ' - ' + ' ' + task.timestamp + ' ' + task.timestamp.format('LLLL') + ' - ' + task.message + '\n';
                    message += task.id + ' - ' + task.message + '\n';
                }

                Remi.sendMessage(msg.chat.id, message).catch(logger.error);
            }
        });
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
