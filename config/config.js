var nconf = require('nconf'),
    path = require('path'),
    Promise = require('bluebird'),
    winston = require('winston');

// allow .es and .jsx files to be compiled on the fly
require('6to5/register')({
    extensions: [".es", ".jsx", ".es6"],
    experimental: true,
    playground: true
});

//
// Sets up globals and configuration
//

// expose bluebird Promises
global.Promise = Promise;

// setup environment variables
global.C = nconf
    .file(__dirname + '/' + process.env.NODE_ENV + '.json')
    .argv()
    .get();

//
// Logging
//

var transports = [
    new winston.transports.Console({
        level: 'verbose',
        colorize: true,
        prettyPrint: true,
        depth: 3
    })
];

if (C.APP.LOGFILE) {
    transports.push(new winston.transports.File({
        level: 'silly',
        colorize: false,
        timestamp: true,
        depth: 3,
        prettyPrint: true,
        json: false,
        filename: path.resolve(__dirname, '..', C.APP.LOGFILE)
    }));
}

global.Log = new winston.Logger({
    transports: transports
}).cli();
