var mongoose = require('mongoose'),
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
// Expose vlad errors
//
module.exports.ValidationError = vlad.ValidationError; // 400
module.exports.FieldValidationError = vlad.FieldValidationError;
module.exports.GroupValidationError = vlad.GroupValidationError;
module.exports.ArrayValidationError = vlad.ArrayValidationError;


//
// Custom errors
//
module.exports.NotAuthorizedError = errorFactory('NotAuthorizedError', ['message']); // 401
module.exports.NotAllowedError = errorFactory("NotAllowedError", ['message']); // 403
module.exports.NotFoundError = errorFactory('NotFoundError', ['message', 'id']); // 404
