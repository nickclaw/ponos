var mongoose = require('mongoose'),
    screen = require('screener'),
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

schema.methods.render = function(user) {
    return module.exports.screen('view', this.toObject());
};

module.exports = mongoose.model('Application', schema);

module.exports.screen = function(action, data) {
    return screen(data, whitelist[action]);
};

var whitelist = {
    view: {
        _id: true,
        job: true,
        owner: true,
        applicant: true,
        blurb: true,
        created: true,
        state: true
    }
};
