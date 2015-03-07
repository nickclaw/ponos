var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectID;

var Location = mongoose.Schema({
    lat: { type: Number },
    long: { type: Number }
});

var Application = mongoose.Schema({
    applicant: { type: ObjectId },
    blurb: { type: String }

    created: { type: Date },
    updated: { type: Date }
});

var schema = mongoose.Schema({
    poster: { type: ObjectId },

    title: { type: String },
    location: { type: Location },
    start: { type: Date },
    end: { type: Date },
    description: { type: String },
    needed: { type: Number },
    rate: { type: Number },

    equipmentProvided: { type: String },
    equipmentRequired: { type: String },
    perks: { type: String }


    // metadata
    created: { type: Date },
    updated: { type: Date }

});

var model = mongoose.model('Job', schema);
module.exports = model;
