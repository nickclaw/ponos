var mongoose = require('mongoose'),
    _ = require('lodash'),
    users = require('../fixtures/users'),
    stub = require('passport-stub');

describe('scaffold apis', function() {

    before(function() {
        this.timeout(7500);
        return require('../../server/server')
            .then(function(results) {
                stub.install(results[1]);
                return Promise.all(
                    _.map(users, function(val, name){
                        var user = new db.User(val);
                        U[name] = user;
                        return Promise.try(user.save, [], user);
                    })
                );
            });
    });

    require('./user');
    require('./job');
    require('./application');

    after(function() {
        if (mongoose.connection) {
            if (mongoose.connection.db) mongoose.connection.db.dropDatabase();
            mongoose.connection.close();
        }
    });
});
