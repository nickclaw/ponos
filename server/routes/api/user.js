var router = require('express').Router(),
    _ = require('lodash'),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

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
    .get('/', function(req, res, next) {
        res.status(200).send([]);
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
        req.doc.set(util.whitelist(req.body, editable));
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

    // returner
    .use(function(req, res, next) {
        res.status(200)
            .send(util.whitelist(req.doc.toObject(), viewable));
    })

    // error handler
    .use(function(err, req, res, next) {
        if (err instanceof db.NotAuthorizedError) return res.sendStatus(403);
        if (err instanceof db.NotFoundError) return res.sendStatus(404);
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

var editable = {
    firstName: true,
    lastName: true,
    phone: true,

    worker: {
        bio: true,
        experience: true,
        age: true,
        gender: true
    },

    employer: {
        bio: true,
        url: true
    }
};

var viewable = {
    _id: true,
    firstName: true,
    lastName: true,
    phone: true,
    roles: true,

    worker: {
        bio: true,
        experience: true,
        age: true,
        gender: true
    },

    employer: {
        bio: true,
        url: true
    },

    new: true,
    finished: true
}
