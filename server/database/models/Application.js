var mongoose = require('mongoose'),
    unique = require('../plugins/unique'),
    timestamp = require('../plugins/timestamp');

var schema = mongoose.Schema({
    applicant: { type: String, ref: "User" },
    ownser: { type: String, ref: "User" },
    job: { type: String, ref: "Job" },
    blurb: { type: String }
});
schema.plugin(unique);
schema.plugin(timestamp);

module.exports = mongoose.model('Application', schema);
