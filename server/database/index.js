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
// Custom errors
//
var NotFoundError = module.exports.NotFoundError = errorFactory('NotFoundError', ['message', 'id']);
var NotAuthorizedError = module.exports.NotAuthorizedError = errorFactory('NotAuthorizedError', ['message']);
var DatabaseError = module.exports.DatabaseError = errorFactory('DatabaseError', ['message', 'id']);
var ValidationError = module.exports.ValidationError = vlad.ValidationError;
var FieldValidationError = module.exports.FieldValidationError = vlad.FieldValidationError;
var GroupValidationError = module.exports.GroupValidationError = vlad.GroupValidationError;
var ArrayValidationError = module.exports.ArrayValidationError = vlad.ArrayValidationError;
