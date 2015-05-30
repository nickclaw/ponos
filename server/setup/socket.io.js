var socket = require('socket.io');
var io = null;
var User = require('../database/models/User');
var _ = require('lodash');

module.exports = (function() {
    io = socket();
    io.listen(8081);

    io.notify = function notify(user, data) {
        data = _.extend({seen: false}, data);

        User.findByIdAndUpdate(user, { $push: {notifications: data}}, function(err, user) {
            io.of('/user/' + user).emit(data);
        });
    };

    return io;
})();
