var vlad = require('vlad');

module.exports = {
    auth: function auth(req, res, next) {
        if (!!req.user) return next();
        next(new db.NotAuthorizedError());
    },

    IdValidator = vlad(vlad.string.within(7, 14));
}
