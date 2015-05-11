var mongoose = require('mongoose'),
    screen = require('screener'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique');

var schema = mongoose.Schema({
    job: { type: String, ref: "Job" },
    users: [{ type: String, ref: "User" }],
    expires: { type: Date, required: true },

    messages: [{
        user: { type: String, ref: "User" },
        message: { type: String, required: true },
        sent: { type: Date, required: true },
        seenBy: [{ type: String, ref: "User" }]
    }]
});
schema.plugin(timestamp);
schema.plugin(unique);

module.exports = mongoose.model('Chat', schema);
