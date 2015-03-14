var router = require('express').Router();

router
    .use('/user/', require('./user'))
    .use('/job/', require('./job'))
;

module.exports = router;
