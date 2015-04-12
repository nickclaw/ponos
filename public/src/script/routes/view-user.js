angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/user/:user', {
            templateUrl: '/static/template/page/view-user.html',
            controller: 'ViewUserController'
        });
    }
])

.controller('ViewUserController', [
    '$scope',
    function($scope) {

    }
]);
