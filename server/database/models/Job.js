var mongoose = require('mongoose'),
    vlad = require('vlad'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique');

var schema = mongoose.Schema({
    poster: { type: String, ref: "User" },

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

//
// Validation
//

schema.methods.validate = function validate(done) {
    jobValidator(this).nodeify(done);
};

var jobValidator = vlad({
    title: vlad.string.required.within(5, 140),
    location: vlad({
        lat: vlad.number.required.within(-90, 90),
        long: vlad.number.required.within(-180, 180)
    }),
    start: vlad.date.required,
    end: vlad.date.required,
    description: vlad.string.required.min(5),
    needed: vlad.integer.required.within(1, 10),
    rate: vlad.number.required.min(1),

    equipmentProvided: vlad.string,
    equipmentRequired: vlad.string,
    perks: vlad.string
});

var model = mongoose.model('Job', schema);
module.exports = model;
