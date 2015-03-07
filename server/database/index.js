var mongoose = require('mongoose'),
    co = require('co'),
    vlad = require('vlad');

var User = require('./models/User');
var Job = require('./models/Job');

var db = module.exports = {}
module.exports.User = User;
module.exports.Job = Job;

var validateId = vlad(vlad.string);

//
// Users
//

/**
 * Get a user by ID
 * @param {String} id
 * @return {Promise}
 */
db.getUser = co.wrap(function*(_id) {
    var id, user;

    try {
        id = yield validateId(_id);
        user = yield User.findById(id, {lean: true}).exec();
    } catch (e) {

    }

    if (!user) throw new Error();
    return user;
});

db.deleteUser = co.wrap(function*(_id) {
    var id, user;

    try {
        id = yield validateId(_id);
        user = yield User.findByIdAndRemove(id).exec();
    } catch (e) {

    }

    if (!user) throw new Error();
    return user;
});

db.updateUser = co.wrap(function*(_id, data) {
    var id, user;

    try {
        id = yield validateId(_id);
        user = yield User.findById(id).exec();
    } catch (e) {

    }

    if (!user) throw new Error();

    try {
        user = yield User.update(data).exec();
    } catch (e) {

    }

    return user.toObject();
});

db.createUser = co.wrap(function*(data) {
    try {
        user = User.create(data).exec();
    } catch (e) {

    }
    return user.toObject();
});
