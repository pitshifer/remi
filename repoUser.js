const _ = require('lodash');
const User = require('./user').User;

const Repository = function() {
    let collection = [];

    this.add = function(user, callback) {
        let existUser;

        if (!(user instanceof User)) {
            callback(new Error('User must be instance from User class'));
        }

        existUser = _.find(collection, function(u) {
            return u.id === user.id
        });

        if (existUser) {
            callback(new Error('User already in the repository'));
            return;
        }

        collection.push(user);
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