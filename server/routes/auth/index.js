var router = require('express').Router();

router.use('/google', require('./google'));
router.use('/facebook', require('./facebook'));
router.use('/local', require('./local'));

// logout route
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// error handling
router.use(function(req, res, next) {
    Log.warn("Unmatched route: " + req.method + " " + req.originalUrl);
    res.status(501).send();
})
.use(function(err, req, res, next) {
    if (err instanceof db.ValidationError) return res.status(400).send(err.toJSON());
    if (err instanceof db.NotAuthorizedError) return res.status(401).send(err.message);
    if (err instanceof db.NotAllowedError) return res.status(403).send(err.message);
    if (err instanceof db.NotFoundError) return res.status(404).send(err.message);

    Log.error(err.message, err.stack);

    return res.status(500).send();
})

module.exports = router;
