var socket = require('socket.io');
var io = null;
var User = require('../database/models/User');
var _ = require('lodash');
var url = require('url');
var redis = require('socket.io-redis');

module.exports = (function() {
    io = socket();
    io.listen(8081);

    var adapter = redis({
        key: C.REDIS.KEY,
        host: C.REDIS.HOST,
        port: C.REDIS.PORT
    });

    io.adapter(adapter);

    // make sure namespace exists
    io.sockets.on('connection', function(socket) {
        var ns = url.parse(socket.handshake.url, true).query.ns;
        Log.silly("connect ns %s", ns);
        io.of('/user/' + ns);

        // TODO remove namespace when user disconnects
        socket.on('disconnect', function(socket) {
            Log.silly("disconnect ns %s", ns);
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
