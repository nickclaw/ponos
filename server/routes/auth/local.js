var router = require('express').Router(),
    passport = require('passport'),
    vlad = require('vlad'),
    socket = require('../../setup/socket.io.js');

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

        setTimeout(function() {
            socket.notify(req.user.id, {
                text: 'Welcome to Scaffold',
                description: "We're glad you joined! You can click here to learn a little bit more about how you can use Scaffold.",
                url: '/about'
            })
        }, 5000);

        res.send(req.user.toObject());
    }
);

module.exports = router;
