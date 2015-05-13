angular.module('scaffold').factory('Poller', [
    '$interval',
    function($interval) {

        function Poller(fn) {
            this.fn = fn;
            this.interval = null;
        }

        Poller.prototype.start = function(interval, count) {
            if (this.timeout) this.stop();
            this.timeout = $interval(this.fn, interval || 1000, count || 0);
        };

        Poller.prototype.stop = function() {
            if (this.timeout) $timeout.cancel(this.timeout);
            this.timeout = null;
        };

        return Poller;
    }
]);
