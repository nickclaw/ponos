var router = require('express').Router();

router
    .use('/user/', require('./user'))
    .use('/job/', require('./job'))
    .use(function(req, res, next) {
        res.send(404, {
            message: "Resource not found."
        });
    })
    .use(function(err, req, res, next) {
        res.send(500, {
            message: "Unknown error."
        });
    });
;

module.exports = router;
