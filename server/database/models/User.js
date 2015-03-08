var mongoose = require('mongoose'),
    _ = require('lodash'),
    bcrypt = require('bcrypt'),
    vlad = require('vlad'),
    timestamp = require('../plugins/timestamp'),
    unique = require('../plugins/unique'),
    ObjectId = mongoose.Schema.Types.ObjectId;

//
// review schema
// works for both worker/employer reviews
//
var Review = mongoose.Schema({
    reviewer: { type: ObjectId },
    job: { type: ObjectId },

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

    roles: { type: [String] },  // in database, let users be worker and/or employer

    // worker specific data
    worker: {
        bio: { type: String },
        experience: { type: String },
        age: { type: String },
        gender: { type: String, enum: ["male", "female"] },

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

//
// Validation
//
schema.methods.validate = function(callback) {
    var validator = newValidator;
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
        experience: vlad.string,
        age: vlad.number.required,
        gender: vlad.enum(['male', 'female']).required
    }),
    auth: authValidator
}, propertyValidations));


var model = mongoose.model('User', schema);
module.exports = model;
