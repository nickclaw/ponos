var mongoose = require('mongoose');

describe.only('scaffolds database interface', function() {

    before(function(next) {
        this.timeout(5000);
        mongoose.connect('mongodb://' + C.DATABASE.HOST + ':' + C.DATABASE.PORT + '/' + C.DATABASE.NAME, {
            user: C.DATABASE.USER,
            pass: C.DATABASE.PASS
        }, function(err) {
            if (err) Log.error('Could not connect to database');
            else Log.info('Connected to database');
            // TODO load any fixtures
            next(err);
        });
    });

    require('./user');
    require('./placeholder');

    after(function() {
        if (mongoose.connection) {
            if (mongoose.connection.db) mongoose.connection.db.dropDatabase();
            mongoose.connection.close();
        }
    });
})
