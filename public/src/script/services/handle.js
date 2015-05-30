angular.module('scaffold').factory('handle', [
    '$mdToast',
    function($mdToast) {

        return function handle(handles, callback) {
            if (typeof handles === 'function' || handles === undefined) {
                callback = handles;
                handles = {};
            }
            handles = handles || {};
            callback = callback || function(reason) {throw reason;};
            return function(reason) {
                var handler = handles[reason.status];
                if (handler) {
                    handler.apply(this, arguments);
                } else {
                    _handle(reason);
                    callback(reason);
                }
            };
        }

        function _handle(reason) {
            switch(reason.status) {
                case 400:
                    $mdToast.showSimple("Invalid input.");
                    break;
                case 401:
                    $mdToast.showSimple("You must be logged in.");
                    break;
                case 403:
                    $mdToast.showSimple("Sorry. You're not allowed to do that.");
                    break;
                case 404:
                    $mdToast.showSimple("Resource not found.");
                    break;
                case 500:
                    $mdToast.showSimple("Server error. Try again.");
                    break;
            }
        }
    }
]);
