var router = require('express').Router(),
    passport = require('passport');

router.post('/login', passport.authenticate('local-login'),
    function(req, res, next) {
        res.redirect('/');
    });

//
// Signup routes
//
router.post('/signup', passport.authenticate('local-signup'),
    function(req, res, next) {
        res.redirect('/new');
    });

module.exports = router;
