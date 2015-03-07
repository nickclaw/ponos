var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectID;

var Review = mongoose.Schema({
    reviewer: { type: ObjectId },
    job: { type: ObjectId },

    comment: { type: String },
    a: { type: Number },
    b: { type: Number },
    c: { type: Number },

    created: { type: Date },
    updated: { type: Date }
});

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
    }

    // metadata
    created: { type: Date },
    updated: { type: Date },
    new: { type: Boolean }, // flag for newly created users
    finished: { type: Boolean } // flag for users without a full profile
});

var model = mongoose.model('User', schema);
module.exports = model;
