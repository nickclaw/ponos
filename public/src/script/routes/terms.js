angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/terms', {
            templateUrl: '/static/template/page/terms.html'
        });
    }
]);
