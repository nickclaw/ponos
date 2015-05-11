angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/messages', {
            templateUrl: '/static/template/page/view-chats.html',
            controller: 'ViewChats',
            resolve: {
                ready: ensure.isReady,
                auth: ensure.isAuthenticated
            }
        });
    }
])

.controller('ViewChats', [
    '$scope',
    'Chat',
    function($scope, Chat) {
        $scope.errored = false;

        $scope.chats = Chat.search();
        $scope.chats.$promise.catch(function() {
            $scope.errored = true;
        });
    }
]);
