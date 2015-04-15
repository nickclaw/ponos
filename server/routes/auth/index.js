var router = require('express').Router();

router.use('/google', require('./google'));
router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));

// logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
