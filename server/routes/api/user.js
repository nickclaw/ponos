var router = require('express').Router(),
    vlad = require('vlad'),
    util = require('./util');

module.exports = router;

router
    .param('user', function(id, req, res, next) {
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

    // implicit get

    .post('/:user', util.auth, owns, function(req, res, next) {
        // TODO remove protected data from body
        req.doc.set(req.body);
        req.doc.save().exec()
            .then(next, next);
    })

    .delete('/:user', util.auth, owns, function(req, res, next) {
        req.doc.remove().exec()
            .then(next, next);
    })

    .post('/', util.auth, function(req, res, next) {

    })

    // returner
    .use(function(req, res, next) {
        // TODO remove private data from doc.toObject()
        res.send(200, req.doc.toObject());
    })

    // error handler
    .use(function(err, req, res, next) {
        if (err instanceof db.NotAuthorizedError) return res.send(403);
        if (err instanceof db.NotFoundError) return res.send(404);
        if (err instanceof db.ValidationError) return res.end(401, err.toJSON());

        return res.send(500);
    })
;

//
// Util
//

function owns(req, res, next) {
    if (req.doc.id === req.user.id) return next();
    next(new db.NotAuthorizedError());
}
