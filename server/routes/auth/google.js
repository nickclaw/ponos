var router = require('express').Router(),
    passport = require('passport');

//
// Login routes
//
router
    .get('/login', passport.authenticate('google-login'))
    .get('/login/callback', passport.authenticate('google-login'),
    function(req, res, next) {
        res.redirect('/');
    });

//
// Signup routes
//
router
    .get('/signup', passport.authenticate('google-signup'))
    .get('/signup/callback', passport.authenticate('google-signup'),
    function(req, res, next) {
        res.redirect('/new');
    });

module.exports = router;
