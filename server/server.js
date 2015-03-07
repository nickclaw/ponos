var async = require('async'),
    mongoose = require('mongoose'),
    express = require('express'),
    passport = require('passport');

var app = express();

require('./setup/passport')(passport)
require('./setup/express')(app, passport);

module.exports = Promise.all([
    new Promise(function(res, rej) {
        app.listen(C.SERVER.PORT, function(err) {
            if (err) {
                Log.error("Server did not start.");
                rej(err);
            } else {
                Log.info("Server listening on port: %s", C.SERVER.PORT);
                res();
            }
        });
    }),

    new Promise(function(res, rej) {
        mongoose.connect('mongodb://' + C.DATABASE.HOST + ':' + C.DATABASE.PORT + '/' + C.DATABASE.NAME, {
            user: C.DATABASE.USER,
            pass: C.DATABASE.PASS
        }, function(err) {
            if (err) {
                Log.error('Could not connect to database');
                rej(err);
            }
            else {
                Log.info('Connected to database');
                res();
            }
        });
    })
]);

module.exports
    .then(function() {
        Log.info("Instance started.");
    })
    .catch(function() {
        Log.error("Could not start instance.");
        Log.error(err.stack);
        process.exit();
    })
    .done();
