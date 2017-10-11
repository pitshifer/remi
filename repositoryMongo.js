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
    lastName: { type: String },
    date: { type: Date }
});

// TASK SCHEMA
Repository.prototype.taskSchema = new mongoose.Schema({
    id: { type: Number },
    type: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    date: { type: Date }
});

exports.Repository = Repository;