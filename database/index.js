var Sequelize = require('sequelize');

var sequelize = new Sequelize(
    C.DATABASE.NAME,
    C.DATABASE.USER,
    C.DATABASE.PASS,
    {
        host: C.DATABASE.HOST,
        dialect: C.DATABASE.DIALECT,
        logging: Log.verbose
    }
);

module.exports = sequelize;

module.exports.User = require('./model/user')(sequelize);

module.exports.promise = new Promise(function(res, rej) {
    sequelize.sync({force: true}).then(res, rej);
});
