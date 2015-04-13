angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve) {
        $routeProvider.when('/user/:user', {
            templateUrl: '/static/template/page/view-user.html',
            controller: 'ViewUserController',
            resolve: {
                user: resolve.user
            }
        });
    }
])

.controller('ViewUserController', [
    '$scope',
    'user',
    function($scope, user) {
        $scope.user = user;
        $scope.reviews = user.$getReviews();
    }
]);
