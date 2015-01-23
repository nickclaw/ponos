var async = require('async'),
    express = require('express'),
    path = require('path'),
    serve = require('serve-static');

var router = require('./routes/');

var app = express();

//
// Configure app
//

// intercept all requests
app.use(function(req, res, next) {
    Log.data('[%s] %s', req.method, req.url);
    next();
});

// add static and dynamic routes
app.use(router);
app.use('/lib', serve(path.join(__dirname, '../public/lib')));
app.use('/', serve(path.join(__dirname, '../public/src/')));

// listen for unmatched routes
app.use(function(req, res) {
    res.sendStatus(404);
});

// listen for uncaught router errors
app.use(function(err, req, res, next) {
    Log.error(err.stack);
    res.sendStatus(500);
});

//
// Start server
//
async.parallel([

    // open server on port
    function(next) {
        app.listen(C.SERVER.PORT, function(err) {
            Log.info("Server listening on port %s", C.SERVER.PORT);
            next(err);
        });
    },

    // connect to database
    function(next) {
        next();
    }

], function(err) {
    if (err) {
        Log.error("Could not start instance.");
        Log.error(err.stack);
        process.exit();
    }

    Log.info("Instance started.");
});
