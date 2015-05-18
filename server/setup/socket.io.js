var socket = require('socket.io');
var io = null;

module.exports = function() {
    if (!io) {
        io = socket();
        io.listen(8081);

        io.on('connection', function() {
            console.log(arguments);
        });
    }
    return io;
}
