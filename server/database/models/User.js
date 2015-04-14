var mongoose = require('mongoose'),
    _ = require('lodash'),
    screen = require('screener'),
    bcrypt = require('bcrypt'),
    vlad = require('vlad'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique');

//
// review schema
// works for both worker/employer reviews
//
var Review = mongoose.Schema({
    reviewer: { type: String, ref: "User" },
    job: { type: String, ref: "Job" },

    comment: { type: String },
    a: { type: Number },
    b: { type: Number },
    c: { type: Number }
});
Review.plugin(unique);
Review.plugin(timestamp);

//
// user schema
//
var schema = mongoose.Schema({

    // shared info
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    birthdate: { type: Date },
    gender: { type: String },

    roles: { type: [String], default: [] },  // in database, let users be worker and/or employer

    // worker specific data
    worker: {
        bio: { type: String },
        experience: { type: [{
            title: String,
            start: Date,
            end: Date,
            description: String
        }] },

        reviews: { type: [Review] }
    },

    // employer specific data
    employer: {
        bio: { type: String },
        url: { type: String },

        reviews: { type: [Review] }
    },

    // signin data
    auth: {
        local: {
            email: { type: String, unique: true, sparse: true },
            password: { type: String },
            confirmation: { type: String }
        },

        google_id: { type: String, unique: true, sparse: true }
    },

    // metadata
    new: { type: Boolean, default: true }, // flag for newly created users
    finished: { type: Boolean, default: false} // flag for users without a full profile
});
schema.plugin(unique);
schema.plugin(timestamp);

// if password has been changed, hash it
// modified from github.com/nickclaw/DrownTheAve
schema.pre('save', function(next) {
    if (this.get('auth.local.password') && this.isModified('auth.local.password')) {
        var salt = bcrypt.genSaltSync(10);
        this.auth.local.password = bcrypt.hashSync(this.get('auth.local.password'), salt);
    }
    next();
});

/**
 * Returns true if the password matches the hashed password
 * borrowed from github.com/nickclaw/DrownTheAve
 * @param {String} unhashed password
 * @return {Boolean}
 */
schema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.auth.local.password);
};

schema.methods.render = function(user) {
    return module.exports.screen('view', this.toObject());
};

//
// Validation
//
schema.methods.validate = function validate(callback) {
    var validator = propertyValidator;
    if (this.isNew) validator = newValidator;
    if (this.roles.includes('worker')) validator = workerValidator;
    if (this.roles.includes('employer')) validator = employerValidator;

    return validator(this).nodeify(callback);
}
var propertyValidations = {
    firstName: vlad.string.min(2).required,
    lastName: vlad.string.min(2).required,
    phone: vlad.string,
    roles: vlad.array.required,
    new: vlad.boolean.required,
    finished: vlad.boolean.required
};

var propertyValidator = vlad(propertyValidations);

var authValidator = function(value) {
    return Promise.resolve();
}

var newValidator = vlad({
    auth: authValidator
});

var employerValidator = vlad(_.extend({
    employer: vlad({
        bio: vlad.string.required,
        url: vlad.string
    }),
    auth: authValidator
}, propertyValidations));

var workerValidator = vlad(_.extend({
    worker: vlad({
        bio: vlad.string.required,
        experience: vlad.array.of(vlad({
            title: vlad.string,
            start: vlad.string,
            end: vlad.string,
            description: vlad.string
        })).max(3).min(0).required
    }),
    auth: authValidator
}, propertyValidations));


var model = mongoose.model('User', schema);
module.exports = model;

module.exports.screen = function(action, data) {
    return screen(data, whitelist[action]);
};

var whitelist = {
    edit: {
        firstName: true,
        lastName: true,
        birthdate: true,
        gender: true,
        phone: true,

        worker: {
            bio: true,
            experience: true
        },

        employer: {
            bio: true,
            url: true
        },

        roles: true
    },

    view: {
        _id: true,
        firstName: true,
        lastName: true,
        birthdate: true,
        gender: true,
        phone: true,
        roles: true,

        worker: {
            bio: true,
            experience: true
        },

        employer: {
            bio: true,
            url: true
        },

        new: true,
        finished: true,
        created: true,
        updated: true
    }
};
