var async = require('async'),
    express = require('express'),
    path = require('path'),
    serve = require('serve-static');

var app = express();

//
// Configure app
//

// intercept all requests
app.use(function(req, res, next) {
    Log.info('Request:', req);
    next();
});

app.use(serve(path.join(__dirname, '../public/src/')));

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
        app.listen(env.server.port, function(err) {
            Log.info("Server listening on port %s", env.server.port);
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
