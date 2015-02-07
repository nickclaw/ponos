var async = require('async'),
    express = require('express');

var app = express();


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
        Log.error(err.stack);ff
        process.exit();
    }

    Log.info("Instance started.");
});
