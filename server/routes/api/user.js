var router = require('express').Router(),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

router
    .param('user', function(req, res, next, id) {
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

    .get('/', function(req, res, next) {
        res.status(200).send([]);
    })

    // implicit GET /user
    .get('/:user', function(req, res, next) {
        next();
    })

    .post('/:user', util.auth, owns, function(req, res, next) {
        // TODO remove protected data from body
        req.doc.save(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    .delete('/:user', util.auth, owns, function(req, res, next) {
        req.doc.remove(function(err, doc) {
            if (err) return next(err);
            next();
        });
    })

    // returner
    .use(function(req, res, next) {
        // TODO remove private data from doc.toObject()
        if (req.doc) return res.status(200).send(req.doc.toObject());
        next(new db.NotFoundError("error bitch"));
    })

    // error handler
    .use(function(err, req, res, next) {
        if (err instanceof db.NotAuthorizedError) return res.sendStatus(403);
        if (err instanceof db.NotFoundError) return res.sendStatus(404);
        if (err instanceof db.ValidationError) return res.status(401).send(err.toJSON());

        Log.error(err);

        return res.status(500).send({message: "WTF"});
    })
;

//
// Util
//

function owns(req, res, next) {
    if (req.doc._id === req.user._id) return next();
    next(new db.NotAuthorizedError());
}
