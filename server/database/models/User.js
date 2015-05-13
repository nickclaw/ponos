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
    picture: { type: String },
    bio: { type: String },
    role: { type: String, default: null },

    // worker specific data
    worker: {
        skills: {type: [String], default: []},
        reviews: { type: [Review] }
    },

    // employer specific data
    employer: {
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

        google_id: { type: String, unique: true, sparse: true },
        facebook_ud: { type: String, unique: true, sparse: true }
    }
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
    if (this.role === 'worker') validator = workerValidator;
    if (this.role === 'employer') validator = employerValidator;

    return validator(this).nodeify(callback);
}
var propertyValidations = {
    firstName: vlad.string.min(2).required,
    lastName: vlad.string.min(2).required,
    role: vlad.string.default(null),
    picture: vlad.string,
    bio: vlad.string
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
        url: vlad.string
    }),
    auth: authValidator
}, propertyValidations));

var workerValidator = vlad(_.extend({
    worker: vlad({
        skills: vlad.array.of(vlad.string).min(0).required
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
        picture: true,
        bio: true,

        worker: {
            skills: true
        },

        employer: {
            url: true
        },

        role: true
    },

    view: {
        _id: true,
        firstName: true,
        lastName: true,
        role: true,
        picture: true,
        bio: true,

        worker: {
            skills: true
        },

        employer: {
            url: true
        },

        created: true,
        updated: true
    }
};
