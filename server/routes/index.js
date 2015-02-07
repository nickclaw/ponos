var router = require('express').Router();

module.exports = router;

router.use('/api', require('./api/'));
router.use('/auth', require('./auth/'));
router.use('/admin', require('./admin/'));
