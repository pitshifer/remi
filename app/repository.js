const _ = require('lodash');

const Repository = function(name) {
    let collection = [];

    this.name = name;

    this.add = function(newItem, callback) {
        let exist = _.find(collection, function(item) {
            return item.id === newItem.id
        });

        if (exist) {
            callback(new Error('Already in the repository'));
            return;
        }

        collection.push(newItem);

        if (callback) {
            callback(null, newItem);
        }
    };

    this.getAll = function*() {
        for (let i in collection) {
            yield collection[i];
        }
    };

    this.count = function() {
        return collection.length;
    };

    this.isExistById = function(id) {
        if (collection.length === 0) {
            return false;
        }

        return _.find(collection, item => {
            return item.id === id;
        })
    }
};

exports.Repository = Repository;