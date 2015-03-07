var mongoose = require('mongoose'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var Application = mongoose.Schema({
    applicant: { type: ObjectId },
    blurb: { type: String }
});
Application.plugin(unique);
Application.plugin(timestamp);

var schema = mongoose.Schema({
    poster: { type: ObjectId },

    title: { type: String },
    location: {
        lat: { type: Number },
        long: { type: Number }
    },
    start: { type: Date },
    end: { type: Date },
    description: { type: String },
    needed: { type: Number },
    rate: { type: Number },

    equipmentProvided: { type: String },
    equipmentRequired: { type: String },
    perks: { type: String }
});
schema.plugin(unique);
schema.plugin(timestamp);

var model = mongoose.model('Job', schema);
module.exports = model;
