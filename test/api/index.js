var mongoose = require('mongoose');

describe('scaffolds api', function() {

    before(function() {
        this.timeout(7500);
        return require('../../server/server');
        // load fixtures?
    });

    require('./placeholder');

    after(function() {
        if (mongoose.connection) {
            mongoose.connection.db.dropDatabase();
            mongoose.connection.close();
        }
    });
});
