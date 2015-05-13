var router = require('express').Router(),
    passport = require('passport');

//
// Login routes
//
router
    .get('/login', passport.authenticate('facebook-login'))
    .get('/login/callback', passport.authenticate('facebook-login'),
    function(req, res, next) {
        res.redirect('/');
    });

//
// Signup routes
//
router
    .get('/signup', passport.authenticate('facebook-signup'))
    .get('/signup/callback', passport.authenticate('facebook-signup'),
    function(req, res, next) {
        res.redirect('/signup');
    });

module.exports = router;
