angular.module('scaffold').factory('io', [
    function() {
        var io = window['io'];
        delete window['io'];
        return io;
    }
]);
