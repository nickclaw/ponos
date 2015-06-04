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
    function($scope) {
        $scope.notifications = ($scope.profile.notifications || []).slice() || [];
        $scope.profile.$acknowledgeNotifications()
            .then(function() {
                $scope.profile.notifications.forEach(function(note) {
                    note.seen = true;
                });
            });
    }
]);
