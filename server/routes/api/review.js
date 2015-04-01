var router = require('express').Router(),
    _ = require('lodash'),
    vlad = require('vlad');

module.exports = router;

//
// Router is mounted on top of user.js router as `/api/user/:id/review`
// meaning we guarunteed access to req.$user
// as well as req.user
//

router

    //
    // Retrieval
    // Averages all review scores and returns the last 3 comments
    .get('/', function(req, res, next) {
        var averages = {a: 0, b: 0, c: 0},
            comments = [],
            reviews = req.$user[req.$user.roles[0]].reviews,
            length = reviews.length;

        reviews.forEach(function(review, i) {
            if (i > length - 3) comments.push(review.comment);
            averages.a += review.a;
            averages.b += review.b;
            averages.c += review.c;
        });

        res.send({
            comments: comments,
            a: averages.a / reviews.length,
            b: averages.b / reviews.length,
            c: averages.c / reviews.length
        });
    })


    //
    // Reviewing
    //
    .post('/',

        // make sure we have an application
        vlad.middleware({
            application: vlad.string.required
        }),

        //
        // We require an application ID as a query parameter
        // intercept the request and fill req.$app with
        function intercept(req, res, next) {
            db.Application
                .findById(req.query.application)
                .populate('job')
                .exec()
                .then(function(app) {
                    if (!app) return next(db.NotFoundError("Application not found."));
                    req.$app = app;
                    next();
                }, next);
        },

        // check post body
        vlad.middleware('body', {
            comment: vlad.string.required,
            a: vlad.integer.required,
            b: vlad.integer.required,
            c: vlad.integer.required
        }),

        function(req, res, next) {
            var role = req.$user.roles[0];

            if (req.$app.job.end > new Date()) return next(db.NotAllowedError("a"));
            if (req.$app.state !== 'accepted') return next(db.NotAllowedError("b"));
            if (_.where(req.$user[role].reviews, {reviewer: req.user.id}).length) return next(db.NotAllowedError('c'));

            req.$user[role].reviews.push({
                reviewer: req.user,
                job: req.$app.job._id,

                comment: req.body.comment,
                a: req.body.a,
                b: req.body.b,
                c: req.body.c
            });

            req.$user.save(function(err) {
                if (err) return next(err);
                res.sendStatus(200);
            });
        }
    );

    // we dont allow editing or deletion
