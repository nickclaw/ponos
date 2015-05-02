var router = require('express').Router(),
    _ = require('lodash'),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

//
// Routing
//
router
    .param('user', function(req, res, next, id) {

        // allow /api/user/me shortcut
        if (id.toLowerCase() === 'me') {
            if (!req.user) return next(db.NotAuthorizedError("Must be signed in."));
            id = req.user._id;
        }

        util.IdValidator(id)
            .then(function(id) {
                return db.User.findById(id).exec();
            })
            .then(function(user) {
                if (!user) throw db.NotFoundError("User not found.", id);
                req.$user = user;
            })
            .then(next, next);
    })

    //
    // Search
    //
    .get('/',
        util.queryValidator,
        function(req, res, next) {
            db.User
                .find()
                .lean()
                .limit(req.query.limit)
                .skip(req.query.offset)
                .exec().then(function(users) {
                    res.send(users.map(function(user) {
                        return user.render(req.user);
                    }))
                }, next);
        }
    )

    //
    // Retrieve
    //
    .get('/:user', send)

    //
    // Update
    //
    .post('/:user',
        util.auth,
        owns,
        function(req, res, next) {
            // TODO remove protected data from body
            req.$user.set(db.User.screen('edit', req.body));
            req.$user.save(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    )

    //
    // Delete
    //
    .delete('/:user',
        util.auth,
        owns,
        function(req, res, next) {
            req.$user.remove(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    );

router.use('/:user/review', require('./review'));


//
// Search users jobs
//

var userJobsQueryValidator = vlad.middleware({
    limit: vlad.integer.default(10).within(0, 25).catch,
    offset: vlad.integer.min(0).default(0),
    type: vlad.enum('filled', 'pending', 'open', 'old')
});

router.get('/:user/jobs', userJobsQueryValidator, function(req, res, next) {
    db.Job
        .find({poster: req.user._id})
        .lean()
        .limit(req.query.offset)
        .skip(req.query.offset)
        .exec().then(function(jobs) {
            res.send(jobs.map(function(job) {
                return job.render(req.user);
            }));
        }, next);
});



//
// Slow, terrible api calls for main page
// Please forgive me...
//

//
// Which jobs are upcoming and filled
// employers only
router.get('/:user/jobs/upcoming',
    util.auth,
    util.role('employer'),
    function(req, res, next) {
        db.Application
            .find({
                owner: req.user.id,
                state: 'accepted'
            })
            .populate('job')
            .exec()
            .then(function(apps) {
                var jobs = {};

                apps.forEach(function(app) {
                    var job = app.job;
                    if (!jobs[job._id]) jobs[job._id] = 0;
                    if (typeof jobs[job._id] !== 'number') return;
                    jobs[job._id]++;
                    if (jobs[job._id] >= job.needed) jobs[job._id] = job;
                });

                jobs = _.filter(jobs, function(job) {
                    return typeof job !== 'number';
                }).map(function(job) {
                    return db.Job.screen('view', job);
                });

                res.send(jobs);

            }).then(null, next);
    }
);

router.get('/:user/jobs/pending',
    util.auth,
    util.role('employer'),
    function(req, res, next) {
        db.Application
            .find({
                owner: req.user.id
            })
            .populate('job')
            .exec()
            .then(function(apps) {
                var jobs = {};

                apps.forEach(function(app) {
                    if (app.state !== 'accepted' && app.state !== 'waiting') return;
                    var job = app.job;
                    if (!jobs[job._id]) jobs[job._id] = 0;
                    if (typeof jobs[job._id] !== 'number') return;
                    jobs[job._id]++;
                    if (jobs[job._id] >= job.needed) jobs[job._id] = job;
                });

                jobs = _.filter(jobs, function(job) {
                    return typeof job === 'number';
                }).map(function(job) {
                    return db.Job.screen('view', job);
                });

                res.send(jobs);
            }).then(null, next);
    }
);


router.get('/:user/jobs/review',
    util.auth,
    util.role('worker', 'employer'),
    function(req, res, next) {
        db.Application
            .find({
                [req.user.role === 'employer' ? 'owner': 'applicant']: req.user.id,
                state: 'accepted'
            })
            .populate('job')
            .exec()
            .then(function(apps) {
                var jobs = {};

                apps.forEach(function(app) {
                    if (app.end > new Date()) return;
                    if (jobs[app.job._id]) return;
                    jobs[app.job._id] = app.job;
                });

                jobs = _.sortBy(jobs, function(a, b) {
                    return a.end > b.end;
                });

                res.send(jobs);
            }).then(null, next);
    }
);

router.get('/:user/jobs/accepted',
    util.auth,
    util.role('worker'),
    function(req, res, next) {
        db.Application
            .find({
                applicant: req.user.id,
                state: 'accepted'
            })
            .populate('job')
            .exec()
            .then(function(apps) {
                var jobs = {};

                apps.forEach(function(app) {
                    if (app.job.start <= new Date()) return;
                    if (jobs[app.job._id]) return;
                    jobs[app.job._id] = app.job;
                });

                jobs = _.sortBy(jobs, function(a, b) {
                    return a.start > b.start;
                });

                res.send(jobs);
            }).then(null, next);
    }
);

router.get('/:user/jobs/waiting',
    util.auth,
    util.role('worker'),
    function(req, res, next) {
        db.Application
            .find({
                applicant: req.user.id
            })
            .populate('job')
            .exec()
            .then(function(apps) {
                var jobs;

                apps.forEach(function(app) {
                    if (app.state !== 'pending' && app.state !== 'rejected') return;
                    if (app.job.start <= new Date()) return;
                    if (jobs[app.job._id]) return;
                    jobs[app.job._id] = app.job;
                });

                jobs = _.sortBy(jobs, function(a, b) {
                    return a.start > b.start;
                });

                res.send(jobs);
            }).then(null, next);
    }
);


//
// Util
//

function send(req, res, next) {
    res.send(req.$user.render(req.user));
}

function owns(req, res, next) {
    if (req.$user._id === req.user._id) return next();
    next(db.NotAllowedError());
}
