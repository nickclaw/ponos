angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/user/:user/edit', {
            templateUrl: '/static/template/page/edit-user.html',
            controller: 'EditUserController'
        });
    }
])

.controller('EditUserController', [
    '$scope',
    function($scope) {
        
    }
]);
