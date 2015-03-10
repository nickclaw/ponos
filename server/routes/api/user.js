var router = require('express').Router(),
    userFilter = require('../../database/filters/user'),
    jobFilter = require('../../database/filters/job'),
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
            if (!req.user) return next(new db.NotAuthorizedError("Must be signed in."));
            req.doc = req.user;
            return next();
        }

        util.IdValidator(id)
            .then(function(id) {
                return db.User.findById(id).exec();
            })
            .then(function(user) {
                if (!user) throw new db.NotFoundError("User not found.", id);
                req.doc = user;
            })
            .then(next, next);
    })

    //
    // Search
    //
    .get('/', util.queryValidator, function(req, res, next) {
        db.User
            .find()
            .lean()
            .limit(req.query.limit)
            .skip(req.query.offset)
            .exec().then(function(users) {
                req.doc = users;
                next();
            }, next);
    })

    //
    // Retrieve
    //
    .get('/:user', function(req, res, next) {
        next();
    })

    //
    // Update
    //
    .post('/:user', util.auth, owns, function(req, res, next) {
        // TODO remove protected data from body
        req.doc.set(util.whitelist(req.body, userFilter.editable));
        req.doc.save(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    //
    // Delete
    //
    .delete('/:user', util.auth, owns, function(req, res, next) {
        req.doc.remove(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    //
    // Search users jobs
    //
    .get('/:user/jobs', util.queryValidator, function(req, res, next) {
        db.Job
            .find({poster: req.user._id})
            .lean()
            .limit(req.query.offset)
            .skip(req.query.offset)
            .exec().then(function(jobs) {
                req.doc = jobs;
                req.filter = jobFilter.viewable;
                next();
            }, next);
    })

    // returner
    .use(function(req, res, next) {
        var data = toJSON(req.doc, req.filter || userFilter.viewable);
        res.status(200)
            .send(data);
    })

    // error handler
    .use(function(err, req, res, next) {
        if (err instanceof db.NotAuthorizedError) return res.status(403).send(err.message);
        if (err instanceof db.NotFoundError) return res.status(404).send(err.message);
        if (err instanceof db.ValidationError) return res.status(401).send(err.toJSON());

        Log.error(err);

        return res.status(500).send();
    })
;

//
// Util
//

function owns(req, res, next) {
    if (req.doc._id === req.user._id) return next();
    next(new db.NotAuthorizedError());
}

function toJSON(data, list) {
    if (data.toObject) {
        return util.whitelist(data.toObject(), list);
    }

    if (Array.isArray(data)) {
        return data.map(function(d) {
            return toJSON(d, list);
        });
    }

    return util.whitelist(data, list);
}
