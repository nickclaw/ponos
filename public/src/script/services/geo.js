angular.module('scaffold').factory('geo', [
    '$q',
    function($q) {
        return function() {
            return $q(function(res, rej) {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(res, rej);
                } else {
                    return rej(null);
                }
            });
        }
    }
]);
