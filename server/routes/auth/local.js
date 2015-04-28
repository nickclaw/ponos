var router = require('express').Router(),
    passport = require('passport');

router.post('/login', passport.authenticate('local-login'),
    function(req, res, next) {
        res.send(req.user.toObject());
    });

//
// Signup routes
//
router.post('/signup', passport.authenticate('local-signup'),
    function(req, res, next) {
        res.send(req.user.toObject());
    });

module.exports = router;
