var S = require('sequelize');

module.exports = function(seq) {

    return seq.define('User', {

        // auth
        authType: S.ENUM('local', 'google'),
        authUser: S.STRING,
        authPass: S.STRING, 

        // profile info
        firstName: S.STRING,
        lastName: S.STRING
    });
}
