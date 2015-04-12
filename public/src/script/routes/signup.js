angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/signup', {
            templateUrl: '/static/template/page/signup.html',
            controller: 'SignupController'
        });
    }
])

.controller('SignupController', [
    '$scope',
    function($scope) {

    }
]);
