var S = require('sequelize');

module.exports = function(seq) {

    seq.define('User', {

        // profile info
        firstName: S.STRING,
        lastName: S.STRING
    });
}
