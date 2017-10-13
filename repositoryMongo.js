const mongoose = require("mongoose");

const Repository = function (name, db, logger) {
    this.name = name;

    const model = db.model(this.name, this[name + "Schema"]);

    this.isExistById = (id, callback) => {
        model.find({id: id}, callback);
    };

    this.add = (item, callback) => {
        this.isExistById(item.id, function(err, models) {
            if (err) {
                logger.error(err);
            } else if (models.length === 0) {
                (new model(item)).save(callback);
            } else {
                logger.info("Model exist in DB already");
            }
        });
    };

    this.getAll = (callback) => {
        model.find({}).exec(callback);
    };

    this.getModelById = (id, callback) => {
        model.findOne({id: id}, callback);
    };
};

// CHAT SCHEMA
Repository.prototype.chatSchema = new mongoose.Schema({
    id: { type: Number },
    type: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    timezone: Number
});

// TASK SCHEMA
Repository.prototype.taskSchema = new mongoose.Schema({
    id: { type: Number },
    chatId: { type: Number },
    createdAt: { type: Date, default: Date.now() },
    message: { type: String },
    text: { type: String },
    hours: { type: Number },
    minutes: { type: Number },
    dateNotif: Date
});

exports.Repository = Repository;