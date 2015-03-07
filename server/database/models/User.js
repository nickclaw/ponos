var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    timestamp = require('../plugins/timestamp'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var Review = mongoose.Schema({
    reviewer: { type: ObjectId },
    job: { type: ObjectId },

    comment: { type: String },
    a: { type: Number },
    b: { type: Number },
    c: { type: Number }
});

Review.plugin(timestamp);

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
        age: { type: Number },
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
    new: { type: Boolean }, // flag for newly created users
    finished: { type: Boolean } // flag for users without a full profile
});

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

var model = mongoose.model('User', schema);
module.exports = model;
