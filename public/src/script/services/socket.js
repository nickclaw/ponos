angular.module('scaffold').factory('socket', [
    function() {
        var io = window['io'];
        delete window['io'];
        return io("http://localhost:8081");
    }
]);
