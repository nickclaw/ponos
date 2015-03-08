var mongoose = require('mongoose')
    request = require('superagent'),
    users = require('../fixtures/users'),
    stub = require('passport-stub');

describe('scaffold apis', function() {

    before(function() {
        this.timeout(7500);
        return require('../../server/server')
            .then(function(results) {
                stub.install(results[1]);
            });
    });

    require('./user');
    require('./job');

    after(function() {
        if (mongoose.connection) {
            if (mongoose.connection.db) mongoose.connection.db.dropDatabase();
            mongoose.connection.close();
        }
    });
});
