var router = require('express').Router(),
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
                    return job.render(req.user);
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
            var data = db.Job.screen('create', req.body);
            data.poster = req.user._id;
            data.applications = [];

            req.$job = new db.Job(data);
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
            req.$job.set(db.Job.screen('edit', req.body));
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
    res.send(req.$job.render(req.user));
}

function owns(req, res, next) {
    if (req.$job.poster === req.user._id) return next();
    next(db.NotAllowedError());
}
