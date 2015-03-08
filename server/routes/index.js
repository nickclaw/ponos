var router = require('express').Router();

module.exports = router;

router
    .use(function(req, res, next) {
        Log.verbose(req.method + ' ' + req.url);
        next();
    })
    .use('/api', require('./api/'))
    .use('/auth', require('./auth/'))
    .use('/admin', require('./admin/'));
