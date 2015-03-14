var mongoose = require('mongoose'),
    vlad = require('vlad'),
    errorFactory = require('error-factory');

//
// Expose models
//
module.exports.User = require('./models/User');
module.exports.Job = require('./models/Job');
module.exports.Application = require('./models/Application');


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
