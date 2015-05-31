angular.module('scaffold')

.config([
    '$routeProvider',
    'ensure',
    function($routeProvider, ensure) {
        $routeProvider.when('/notifications', {
            templateUrl: '/static/template/page/view-notifications.html',
            controller: 'ViewNotifications',
            resolve: {
                isAuthenticated: ensure.isAuthenticated,
                isReady: ensure.isReady
            }
        });
    }
])

.controller('ViewNotifications', [
    '$scope',
    'profile',
    function($scope, profile) {
        $scope.notifications = profile.notifications || [];


    }
]);
