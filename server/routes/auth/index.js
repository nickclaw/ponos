var router = require('express').Router();

router.use('/google', require('./google'));
router.use('/local', require('./local'));

// logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
