var router = require('express').Router(),
    util = require('./util'),
    vlad = require('vlad');

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
        vlad.middleware('body', {
            blurb: vlad.string.required
        }),
        function(req, res, next) {
            var data = req.body;
            data.applicant = req.user;
            data.owner = req.$job.owner;
            data.job = req.$job;

            req.$app = new db.Application(data);
            req.$app.save(next);
            res.send(req.$app.toObject());
        }
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
            db.Application
            .find({
                owner: req.user.id
            })
            .populate('job')
            .populate('applicant')
            .exec(function(err, apps) {
                if (err) return next(err);

                var obj = {
                    pending: [],
                    rejected: [],
                    waiting: [],
                    accepted: []
                };

                apps.forEach(function(app) {
                    obj[app.state].push(
                        app.toObject() // TODO whitelist
                    );
                });

                res.send(obj);
            });
        }
    )

    //
    // Accept an application
    // This can only be one by the owner (while pending)
    // or the applicant (while waiting)
    //
    .post('/:app/accept',
        util.auth,
        state('pending', 'waiting'),
        function(req, res, next) {
            var save = false; // TODO isModified?
            if (isOwner(req) && hasState(req, 'pending')) {
                req.$app.state = 'waiting';
                save = true;
            }

            if (isApplicant(req) && hasState(req, 'waiting')) {
                req.$app.state = 'accepted';
                save = true;
            }

            if (save) {
                req.$app.save(function(err) {
                    if (err) return next(err);
                    res.send(200);
                });
            } else {
                next(db.NotAllowedError());
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
            req.$app.remove().exec(function(err) {
                if (err) return next(err);
                res.send(200);
            });
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
            req.$app.state = 'rejected';
            req.$app.save(function(err){
                if (err) return next(err);
                res.send(200);
            });
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

    return job.poster === user._id;
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
