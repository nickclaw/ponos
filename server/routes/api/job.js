var router = require('express').Router(),
    jobFilter = require('../../database/filters/job'),
    applicationFilter = require('../../database/filters/application'),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

router
    .param('job', function(req, res, next, id) {
        util.IdValidator(id)
            .then(function(id) {
                return db.Job.findById(id).exec();
            })
            .then(function(job) {
                if (!job) throw db.NotFoundError("Job not found.", id);
                req.filter = jobFilter.viewable;
                req.$job = job;
            })
            .then(next, next);
    })

    //
    // Search
    //
    .get('/', function(req, res, next) {
        db.Job.find({}).exec()
            .then(function(jobs) {
                res.send(jobs.map(function(job) {
                    return job.toObject();
                }));
            });
    })

    //
    // Create
    //
    .post('/',
        util.auth,
        util.role('employer'),
        function(req, res, next) {
            var data = util.whitelist(req.body, jobFilter.createable);
            data.poster = req.user._id;
            data.applications = [];

            req.$job = new db.Job(data);
            req.filter = jobFilter.viewable;
            req.$job.save(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    )

    //
    // Retrieve
    //
    .get('/:job', send)

    //
    // Update
    //
    .post('/:job',
        util.auth,
        owns,
        function(req, res, next) {
            // TODO remove protected data from body
            req.$job.set(util.whitelist(req.body, jobFilter.editable));
            req.$job.save(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    )

    //
    // Delete
    //
    .delete('/:job',
        util.auth,
        owns,
        function(req, res, next) {
            req.$job.remove(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    )

    //
    // Job applications
    //
    .use('/:job/application', require('./application'));
;

//
// Util
//

function send(req, res, next) {
    var data = util.whitelist(req.$job.toObject(), req.filter);
    res.status(200).send(data);
}

function owns(req, res, next) {
    if (req.$job.poster === req.user._id) return next();
    next(db.NotAllowedError());
}
