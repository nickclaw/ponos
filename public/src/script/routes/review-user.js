angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/user/:user/review/:job', {
            templateUrl: '/static/template/page/review-user.html',
            controller: 'ReviewUserController'
        });
    }
])

.controller('ReviewUserController', [
    '$scope',
    function($scope) {

    }
]);
