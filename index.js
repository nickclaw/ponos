var cluster = require('cluster'),
    winston = require('winston');

// add globals: Log, C, Promise
require('./config/config.js');

if (cluster.isMaster) {
    var numClusters = Math.min(require('os').cpus().length, C.APP.MAX_CPUS);

    Log.info("Starting up master instance.");
    Log.info("Spinning up %s clusters.", numClusters);

    // spin up as many instances as possible
    for (var i = 0; i < numClusters; i++) {
        cluster.fork();
    }

    // log when a worker exits
    cluster.on('exit', function(worker) {
        if (worker.suicide) {
            Log.info("Worker %s exited.", worker.id)
        } else {
            Log.error("Worker %s died.", worker.id);
        }
        cluster.fork();
    });

} else {

    // append worker id before text so we can filter by worker
    Log.log = function() {
        arguments[1] = '[' + cluster.worker.id + '] ' + arguments[1];
        winston.Logger.prototype.log.apply(this, arguments);
    };

    Log.info('Online.');

    require('./app/server');
}

// log any uncaught expections
process.on('uncaughtException', function(err) {
    Log.error("Uncaught Exception: \n", err.stack);
});
