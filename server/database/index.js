var mongoose = require('mongoose'),
    co = require('co'),
    vlad = require('vlad'),
    errorFactory = require('error-factory');

var User = require('./models/User');
var Job = require('./models/Job');

//
// Expose models
//
var db = module.exports = {}
module.exports.User = User;
module.exports.Job = Job;

//
// Custom errors
//
var NotFoundError = module.exports.NotFoundError = errorFactory('NotFoundError', ['message', 'id']);
var DatabaseError = module.exports.DatabaseError = errorFactory('DatabaseError', ['message', 'id']);
var ValidationError = module.exports.ValidationError = vlad.ValidationError;
var FieldValidationError = module.exports.FieldValidationError = vlad.FieldValidationError;
var GroupValidationError = module.exports.GroupValidationError = vlad.GroupValidationError;
var ArrayValidationError = module.exports.ArrayValidationError = vlad.ArrayValidationError;

var validateId = vlad(vlad.string);

//
// Users
//

/**
 * Get a user by ID
 * @param {String} id
 * @return {Promise}
 */
db.getUser = wrap(function*(_id) {
    var id = yield validateId(_id),
        user = yield User.findById(id).exec();

    if (!user) throw new NotFoundError("User not found.", id);
    return user.toObject();
});

db.deleteUser = wrap(function*(_id) {
    var id = yield validateId(_id),
        user = yield User.findByIdAndRemove(id).exec();

    if (!user) throw new NotFoundError("User not found.", id);
    return user.toObject();
});

db.updateUser = wrap(function*(_id, data) {
    var id = yield validateId(_id),
        user = yield User.findById(id).exec();

    if (!user) throw new NotFoundError("User not found.", id);

    yield user.update(data).exec();

    return user.toObject();
});

db.createUser = wrap(function*(data) {
    var user = yield User.create(data);

    return user.toObject();
});

function wrap(fn) {
    fn = co.wrap(fn);

    return function() {
        return fn.apply(fn, arguments)
            .catch(function(e) {
                if (e instanceof ValidationError) throw e;
                if (e instanceof NotFoundError) throw e;
                var error = new DatabaseError(e.message);
                error.stack = e.stack;
                throw error;
            });
    }
}
