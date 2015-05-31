var socket = require('socket.io');
var io = null;
var User = require('../database/models/User');
var _ = require('lodash');
var url = require('url');

module.exports = (function() {
    io = socket();
    io.listen(8081);

    // make sure namespace exists
    io.sockets.on('connection', function(socket) {
        var ns = url.parse(socket.handshake.url, true).query.ns;
        io.of('/user/' + ns);

        // TODO remove namespace when user disconnects
        socket.on('disconnect', function(socket) {
            console.log("disconnect ns", ns);
        });
    });

    io.notify = function notify(user, data) {
        data = _.extend({seen: false}, data);

        User.findByIdAndUpdate(user, { $push: {notifications: data}}, function(err, u) {
            if (err) return Log.warn('Notification error: %s -> ', user, data);
            io.of('/user/' + user).emit('notification', u.notifications[u.notifications.length - 1]);
        });
    };

    return io;
})();
