const _ = require('lodash');

const Repository = function() {
    let collection = [];

    this.add = function(newItem, callback) {
        let exist = _.find(collection, function(item) {
            return item.id === newItem.id
        });

        if (exist) {
            callback(new Error('Already in the repository'));
            return;
        }

        collection.push(newItem);
        callback();
    };

    this.getAll = function*() {
        for (let i in collection) {
            yield collection[i];
        }
    };

    this.count = function() {
        return collection.length;
    }
};

exports.Repository = Repository;