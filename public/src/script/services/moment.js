angular.module('scaffold').provider('moment', function() {

    var moment = window.moment;
    delete window.moment;

    this.$get = [
        function() {
            return moment;
        }
    ];
});
