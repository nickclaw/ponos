angular.module('scaffold').factory('$history', [
    '$rootScope',
    '$location',
    function($rootScope, $location) {

        var lastState = null, isReady = false;

        $rootScope.$on('$locationChangeSuccess', function(newState, oldState) {
            lastState = oldState;
        });

        $rootScope.$on('$routeChangeSuccess', function() {
            isReady = true;
        });

        var $history = Object.create(window.history);
        $history.back = function(def) {
            if (lastState && isReady) return window.history.back();
            if (def) $location.url(def);
            $location.url('/');
        };

        return $history;
    }
]);
