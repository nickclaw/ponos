var nconf = require('nconf'),
    Promise = require('bluebird'),
    winston = require('winston');

//
// Sets up globals and configuration
//

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
global.C = nconf
    .argv()
    .file('./' + process.env.NODE_ENV + '.json')
    .get();

// expose bluebird Promises
global.Promise = Promise;
