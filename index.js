var cluster = require('cluster'),
    winston = require('winston'),
    nconf = require('nconf'),
    os = require('os');

// setup logging and expose it globally
global.Log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            colorize: true,
            timestamp: true,
            prettyPrint: true,
            depth: 3
        })
    ]
});
Log.cli();

// setup environment variables
global.env = nconf
    .argv()
    .file('./config/' + process.env.NODE_ENV + '.json')
    .get();

if (cluster.isMaster) {
    var numClusters = require('os').cpus().length;

    Log.info("Starting up master instance...");
    Log.info("Spinning up %s clusters...", numClusters);

    // spin up as many instances as possible
    for (var i = 0; i < numClusters; i++) {
        cluster.fork();
    }

    // log when a worker is online
    cluster.on('online', function(worker) {
        Log.info("Worker %s is online.", worker.id);
    });

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


    Log.log = function() {
        arguments[1] = '[' + cluster.worker.id + '] ' + arguments[1];
        winston.Logger.prototype.log.apply(this, arguments);
    };

    require('./app/');
}

// log any uncaught expections
process.on('uncaughtException', function(err) {
    Log.info(err.message, err.stack);
});
