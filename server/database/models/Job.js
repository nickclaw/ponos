var mongoose = require('mongoose'),
    vlad = require('vlad'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var Application = mongoose.Schema({
    applicant: { type: ObjectId, ref: "User" },
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
    perks: { type: String },

    applications: [Application]
});
schema.plugin(unique);
schema.plugin(timestamp);

var model = mongoose.model('Job', schema);
module.exports = model;

//
// Validation
//

schema.methods.validate = function validate(done) {
    jobValidator(this).nodeify(done);
};

var jobValidator = vlad({
    title: vlad.string.required,
    location: vlad({
        lat: vlad.number.required,
        long: vlad.number.required
    }),
    start: vlad.date.required,
    end: vlad.date.required,
    description: vlad.string.required,
    needed: vlad.integer.required,
    rate: vlad.number.required,

    equipmentProvided: vlad.string,
    equipmentRequired: vlad.string,
    perks: vlad.string
});
