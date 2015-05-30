var router = require('express').Router(),
    passport = require('passport'),
    vlad = require('vlad');

router.post('/login',
    passport.authenticate('local-login'),
    vlad.middleware('body', {
        email: vlad.string.required.pattern(/.+@.+/).min(1),
        password: vlad.string.required.min(1)
    }),
    function(req, res, next) {
        res.send(req.user.toObject());
    });

//
// Signup routes
//
router.post('/signup',
    vlad.middleware('body', {
        email: vlad.string.required.pattern(/.+@.+/).min(1),
        password: vlad.string.required.min(1)
    }),
    passport.authenticate('local-signup'),
    function(req, res, next) {
        res.send(req.user.toObject());
    }
);

module.exports = router;
