var mongoose = require('mongoose'),
    vlad = require('vlad'),
    screen = require('screener'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique');

var schema = mongoose.Schema({
    poster: { type: String, ref: "User" },

    title: { type: String },
    location: {
        name: { type: String },
        lat: { type: Number, default: 0.0 },
        long: { type: Number, default: 0.0 }
    },
    start: { type: Date },
    end: { type: Date },
    description: { type: String },
    needed: { type: Number },
    rate: { type: Number },

    equipmentProvided: { type: String },
    perks: { type: String },
});
schema.plugin(unique);
schema.plugin(timestamp);

schema.methods.render = function(user) {
    return module.exports.screen('view', this.toObject());
};

//
// Validation
//

schema.methods.validate = function validate(done) {
    jobValidator(this).nodeify(done);
};

var jobValidator = vlad({
    title: vlad.string.required.within(5, 140),
    location: vlad({
        name: vlad.string.required.min(1),
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

module.exports.screen = function(action, data) {
    return screen(data, whitelist[action]);
};

var whitelist = {
    create: {
        title: true,
        location: {
            name: true,
            lat: true,
            long: true
        },

        start: true,
        end: true,
        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true
    },

    edit: {
        title: true,
        location: {
            name: true,
            lat: true,
            long: true
        },

        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true
    },

    view: {
        _id: true,
        poster: true,
        title: true,
        location: {
            name: true,
            lat: true,
            long: true
        },
        applications: true,
        application: true,

        start: true,
        end: true,
        description: true,
        needed: true,
        rate: true,
        equipmentProvided: true,
        equipmentRequired: true,
        perks: true,
        created: true,
        updated: true
    }
};
