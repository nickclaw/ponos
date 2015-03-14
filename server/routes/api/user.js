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
            if (!req.user) return next(db.NotAuthorizedError("Must be signed in."));
            id = req.user._id;
        }

        util.IdValidator(id)
            .then(function(id) {
                return db.User.findById(id).exec();
            })
            .then(function(user) {
                if (!user) throw db.NotFoundError("User not found.", id);
                req.doc = user;
                req.filter = userFilter.viewable;
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
                    req.doc = users;
                    next();
                }, next);
        },
        send
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
            req.doc.set(util.whitelist(req.body, userFilter.editable));
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
    .delete('/:user',
        util.auth,
        owns,
        function(req, res, next) {
            req.doc.remove(function(err, doc) {
                if (err) return next(err);
                next();
            });
        },
        send
    );


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
            req.doc = jobs;
            req.filter = jobFilter.viewable;
            next();
        }, next);
});


router
    .use(function(req, res, next) {
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
    var data = toJSON(req.doc, req.filter);
    res.status(200).send(data);
}

function owns(req, res, next) {
    if (req.doc._id === req.user._id) return next();
    next(db.NotAllowedError());
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
