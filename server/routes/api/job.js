var router = require('express').Router(),
    jobFilter = require('../../database/filters/job'),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

router
    .param('job', function(req, res, next, id) {
        util.IdValidator(id)
            .then(function(id) {
                return db.Job.findById(id).exec();
            })
            .then(function(user) {
                if (!user) throw db.NotFoundError("Job not found.", id);
                req.doc = user;
            })
            .then(next, next);
    })

    //
    // Search
    //
    .get('/', function(req, res, next) {
        res.status(200).send([]);
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

            req.doc = new db.Job(data);
            req.doc.save(function(err, doc) {
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
            req.doc.set(util.whitelist(req.body, jobFilter.editable));
            req.doc.save(function(err, doc) {
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
            req.doc.remove(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    )

    //
    // Apply for job
    //
    .post('/:job/apply',
        util.auth,
        util.role('worker'),
        function(req, res, next) {

        },
        send
    )

    //
    // Errors
    //
    .use(function(req, res, next) {
        Log.warn("Unmatched route: " + req.method + " " + req.url);
        res.status(501).send();
    })
    .use(function(err, req, res, next) {
        if (err instanceof db.ValidationError) return res.status(400).send(err.toJSON());
        if (err instanceof db.NotAuthorizedError) return res.status(401).send(err.message);
        if (err instanceof db.NotAllowedError) return res.status(403).send(err.message);
        if (err instanceof db.NotFoundError) return res.status(404).send(err.message);

        Log.error(err.message, err.stack);

        return res.status(500).send();
    })
;

//
// Util
//

function send(req, res, next) {
    res.status(200)
        .send(util.whitelist(req.doc.toObject(), jobFilter.viewable));
}

function owns(req, res, next) {
    if (req.doc.poster === req.user._id) return next();
    next(db.NotAllowedError());
}
