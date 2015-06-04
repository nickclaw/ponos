var mongoose = require('mongoose'),
    vlad = require('vlad'),
    screen = require('screener'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique');

var schema = mongoose.Schema({
    poster: { type: String, ref: "User" },

    title: { type: String },
    category: { type: String },
    location: {
        name: { type: String },
        coords: [Number]
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

schema.index({
    'title': 'text',
    'description': 'text',
    'equipmentProvided': 'text',
    'perks': 'text'
}, {
    name: "text_search",
    weights: {
        "title": 5,
        "description": 5,
        'equipmentProvided': 3,
        'perks': 2
    }
});

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
    category: vlad.string.required,
    location: vlad({
        name: vlad.string.required.min(1),
        coords: vlad.array.of(vlad.number)
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

model.ensureIndexes();

module.exports.screen = function(action, data) {
    return screen(data, whitelist[action]);
};

var whitelist = {
    create: {
        title: true,
        category: true,
        location: true,

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
        category: true,
        location: true,

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
        category: true,
        location: true,
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
