var nconf = require('nconf'),
    path = require('path'),
    Promise = require('bluebird'),
    winston = require('winston'),
    shortId = require('shortid');

// allow .es files to be compiled on the fly
require('babel/register')({
    extensions: [".es", ".js"],
    experimental: true,
    playground: true
});

//
// Setup globals & configuration
//

// expose bluebird Promises
global.Promise = Promise;

// setup environment variables
global.C = nconf
    .file(__dirname + '/' + process.env.NODE_ENV + '.json')
    .argv()
    .get();

global.db = require('../server/database/');

//
// Logging
//

var transports = [ ];

if (C.LOGGING.CONSOLE.ENABLED) {
    transports.push(new winston.transports.Console({
        level: C.LOGGING.CONSOLE.LEVEL,
        colorize: true,
        prettyPrint: true,
        depth: 3
    }));
}

if (C.LOGGING.FILE.ENABLED) {
    transports.push(new winston.transports.File({
        level: C.LOGGING.FILE.LEVEL,
        colorize: false,
        timestamp: true,
        depth: 3,
        prettyPrint: true,
        json: false,
        filename: path.resolve(__dirname, '..', C.LOGGING.FILE.NAME)
    }));
}

global.Log = new winston.Logger({
    transports: transports
}).cli();

//
// ID generation
//

shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+');
shortId.seed(C.APP.SEED);
