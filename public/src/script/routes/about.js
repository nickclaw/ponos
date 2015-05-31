angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/about',{
            templateUrl: '/static/template/page/about.html'
        });
    }
]);
