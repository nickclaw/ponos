var chai = require('chai'),
    asPromised = require('chai-as-promised');

// add globals: Log, C, Promise
require('../config/config');

chai.should();
chai.use(asPromised);

// expose expect for nice looking tests
global.expect = chai.expect;
