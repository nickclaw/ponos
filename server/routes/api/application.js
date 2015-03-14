var router = require('express').Router(),
    util = require('./util');

module.exports = router;

//
// This router is attached to the /api/job/:id/application
// route, meaning it is guaranteed access to req.$job
//

router

    .param('app', function(req, res, next, id) {
        util.IdValidator(id)
        .then(function() {
            return db.Application.findById(id).exec();
        })
        .then(function(app) {
            if (!app) throw db.NotFoundError();
            req.$app = app;
            // req.filter?
        })
        .then(next, next);
    })

    //
    // Apply
    // This can only be done by workers
    //
    .post('/',
        util.auth,
        util.role('worker'),
        // has not applied
        function(req, res, next) {

        },
        send
    )

    //
    // View applications
    // This can only be done by the owner
    //
    .get('/',
        util.auth,
        util.role('employer'),
        isOwnerMiddleware,
        function(req, res, next) {

        },
        send
    )

    //
    // Get application
    // TODO do we need this?
    //
    .get('/:app', send)

    //
    // Accept an application
    // This can only be one by the owner (while pending)
    // or the applicant (while waiting)
    //
    .post('/:app/accept',
        util.auth,
        state('pending', 'waiting'),
        function(req, res, next) {
            if (isOwner(req) && hasState(req, 'pending')) {

            }

            if (isApplicant(req) && hasState(req, 'waiting')) {

            }
        }
    )

    //
    // Withdraw an application
    // This can only be done by the applicant
    // before the application has been accepted by them
    //
    .post('/:app/withdraw',
        util.auth,
        util.role('worker'),
        isApplicantMiddleware,
        state('pending', 'rejected', 'waiting'),
        function(req, res, next) {

        }
    )

    //
    // Reject an application
    // This can only be done by the owner
    // before the application has been accepted by the applicant
    //
    .post('/:app/reject',
        util.auth,
        util.role('employer'),
        isOwnerMiddleware,
        state('pending', 'waiting'),
        function(req, res, next) {

        }
    )

//
// Util
//

function send() {

}


function isOwner(req) {
    var user = req.user,
        job = req.$job;

    return job.owner === user._id;
}

function isApplicant(req) {
    var app = req.$app,
        user = req.user;

    return app.applicant === user._id;
}

function isOwnerMiddleware(req, res, next) {
    if (isOwner(req)) return next();
    next(db.NotAllowedError());
}

function isApplicantMiddleware(req, res, next) {
    if (isApplicant(req)) return next();
    next(db.NotAllowedError());
}

function hasState(req, state) {
    return req.$app.state === state;
}

/**
 * Verify an application is of a state
 * @param {String...} states
 * @return {Function} middleware
 */
function state() {
    var args = Array.prototype.slice.call(arguments);
    return function(req, res, next) {
        for (var i = 0; i < args.length; i++) {
            if (hasState(req, args[i])) {
                return next();
            }
        }
        next(db.NotAllowedError("TODO message"));
    }
}
