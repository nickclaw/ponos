var vlad = require('vlad'),
    _ = require('lodash');

module.exports = {

    /**
     * Make sure a user is logged in
     */
    auth: function auth(req, res, next) {
        if (!!req.user) return next();
        next(new db.NotAuthorizedError("Not authorized."));
    },

    /**
     * Make sure current user is of a certain role
     */
    role: function(role) {
        return function hasRole(req, res, next) {
            if (req.user.role === role) return next();
            next(new db.NotAllowedError("Wrong role."));
        };
    },

    //
    // Common validation
    //

    /**
     * Validate shortid length
     */
    IdValidator: vlad(vlad.string.within(7, 14)),

    /**
     * Validate standard query request
     */
    queryValidator: vlad.middleware({
        limit: vlad.integer.default(10).within(0, 25).catch,
        offset: vlad.integer.min(0).default(0),
        query: vlad.string // unsupported for now
    })
};
