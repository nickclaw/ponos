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
        $scope.chats = Chat.search();
    }
]);
