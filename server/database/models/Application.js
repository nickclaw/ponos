var mongoose = require('mongoose'),
    unique = require('../plugins/unique'),
    timestamp = require('../plugins/timestamp');

var schema = mongoose.Schema({
    applicant: { type: String, ref: "User" },
    owner: { type: String, ref: "User" },
    job: { type: String, ref: "Job" },

    state: { type: String, default: 'pending', enum: [
        'pending',  // first created - withdrawable
        'rejected', // app rejected - withdrawable
        'waiting',  // accepted by employer - awaiting response - withdrawable
        'accepted'  // accepted by worker also
    ] },
    blurb: { type: String }
});
schema.plugin(unique);
schema.plugin(timestamp);

module.exports = mongoose.model('Application', schema);
