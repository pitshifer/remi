const mongoose = require("mongoose");

const Repository = function (name, db, logger) {
    this.name = name;
    this.db = db;
    this.logger = logger;

    this.model = this.db.model(this.name, this[name + "Schema"]);

    this.isExistById = (id, callback) => {
        this.model.find({id: id}, callback);
    };

    this.add = (item, callback) => {
        let that = this;
        this.isExistById(item.id, function(err, models) {
            if (err) {
                logger.error(err);
            } else if (models.length === 0) {
                (new that.model(item)).save(callback);
            } else {
                logger.info("Model exist in DB already");
            }
        });
    };
};

// CHAT SCHEMA
Repository.prototype.chatSchema = new mongoose.Schema({
    id: { type: Number },
    type: { type: String },
    firstName: { type: String },
    lastName: { type: String }
});

// TASK SCHEMA
Repository.prototype.taskSchema = new mongoose.Schema({
    id: { type: Number },
    chatId: { type: Number },
    createdAt: { type: Date, default: Date.now() },
    message: { type: String },
    text: { type: String },
    hours: { type: Number },
    minutes: { type: Number }
});

exports.Repository = Repository;