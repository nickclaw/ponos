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
                if (!user) throw new db.NotFoundError("Job not found.", id);
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
    .post('/', util.auth, util.role('employer'), function(req, res, next) {
        var data = util.whitelist(req.body, jobFilter.createable);
        data.poster = req.user._id;
        data.applications = [];

        req.doc = new db.Job(data);
        req.doc.save(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    //
    // Retrieve
    //
    .get('/:job', function(req, res, next) {
        next();
    })

    //
    // Update
    //
    .post('/:job', util.auth, owns, function(req, res, next) {
        // TODO remove protected data from body
        req.doc.set(util.whitelist(req.body, jobFilter.editable));
        req.doc.save(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    //
    // Delete
    //
    .delete('/:job', util.auth, owns, function(req, res, next) {
        req.doc.remove(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    //
    // Apply for job
    //
    .post('/:job/apply', util.auth, util.role('worker'), function(req, res, next) {

    })

    // returner
    .use(function(req, res, next) {
        res.status(200)
            .send(util.whitelist(req.doc.toObject(), jobFilter.viewable));
    })

    // error handler
    .use(function(err, req, res, next) {
        if (err instanceof db.NotAuthorizedError) return res.status(403).send(err.message);
        if (err instanceof db.NotFoundError) return res.status(404).send(err.message);
        if (err instanceof db.ValidationError) return res.status(401).send(err.toJSON());

        Log.error(err);

        return res.sendStatus(500);
    })
;

//
// Util
//

function owns(req, res, next) {
    if (req.doc.poster === req.user._id) return next();
    next(new db.NotAuthorizedError());
}
