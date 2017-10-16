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
moment.utc();
moment.locale('ru');

let tasks = new Repository('task', db, logger);
let chats = new Repository('chat', db, logger);
const Remi = new TelegramBot(config.botToken, {'polling': true});


const notifier = () => {
    tasks.getTaskToday((err, tasks) => {
        console.log('NOTIFIER DO');
        if (err) {
            logger.error(err);
        } else {
            for (task of tasks) {
                Remi.sendMessage(task.chatId, task.message);
            }
        }
    });
};

setInterval(notifier, 60000);

const ChatRegister = (msg) => {
    chats.add(new Chat(msg), (err, model) => {
        if (err) {
            logger.error(err);
        } else {
            logger.info({newChat: model}, 'Register new chat');

            Remi.sendMessage(model.id, "Здоров, " + model.firstName);
            Remi.sendMessage(model.id, "Давай-ка установим время, а то пока я думаю что у тебя сейчас - " + moment().format("D MMMM hh:mm"));
            Remi.sendMessage(model.id, "Для установки времени набери /time hh:mm");
        }
    });
};

const setTime = (chatId, hours, minutes) => {
    chats.getModelById(chatId, (err, model) => {
        if (err) {
            logger.error(err);
        } else {
            let now = moment();
            let datetime = moment(now);
            datetime.hour(hours);
            datetime.minute(minutes);

            model.timezone = datetime.diff(now, "minutes");
            model.save((err, model) => {
                if (err) {
                    logger.error(err);
                } else {
                    logger.info("Set timezone for chat");
                    Remi.sendMessage(model.id, "Отлично, я записал, что у тебя сейчас - " + moment().utcOffset(model.timezone).toString('LLLL'));
                }
            });
        }
    });
};

Remi.on('message', ChatRegister);

Remi.onText(/^([0-1]\d|2[0-3])[: ]([0-5]\d)(.+$)/, (msg, match) => {
    let chatId = msg.chat.id;
    let hours = match[1];
    let minutes = match[2];
    let text = match[3].trim();

    chats.getModelById(chatId, (err, chat) => {
        if (err) {
            logger.error('Не найден чат');
        } else {
            tasks.add(new Task(msg, chat, hours, minutes, text), function (err, newTask) {
                if (err) {
                    logger.error(err);
                    Remi.sendMessage(chatId, "Упс... не понял, что ты имеешь в виду.").catch(logger.error);
                } else {
                    logger.info({newTask: newTask}, "Accepted new task");
                    Remi.sendMessage(chatId, 'Ok, понял \u{1F609}').catch(logger.error);
                }
            });
        }
    });
});

Remi.onText(/^\/time\s(\d{2}):(\d{2})$/, (msg, match) => {
    setTime(msg.chat.id, match[1], match[2]);
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
});
