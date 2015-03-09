var vlad = require('vlad'),
    _ = require('lodash');

module.exports = {

    /**
     * Make sure a user is logged in
     */
    auth: function auth(req, res, next) {
        if (!!req.user) return next();
        next(new db.NotAuthorizedError());
    },

    /**
     * Validate shortid length
     */
    IdValidator: vlad(vlad.string.within(7, 14)),

    /**
     * Returns a new object that only contains whitelisted paths
     * @param {Object} object
     * @param {Object} list
     * @return {Object}
     */
    whitelist: function whitelist(object, list) {
        var obj = {};

        _.each(object, function(value, key) {
            if (typeof list[key] === 'object') {
                obj[key] = whitelist(object[key], list[key]);
            } else if (list[key]) {
                obj[key] = value;
            }
        });

        return obj;
    }
};
