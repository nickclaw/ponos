angular.module('scaffold').factory('C', [
    function() {
        var C = window['__C'];
        delete window['__C'];
        return C;
    }
]);
