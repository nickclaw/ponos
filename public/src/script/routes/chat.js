angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/message/:chat', {
            templateUrl: '/static/template/page/chat.html',
            controller: 'Chat',
            resolve: {
                ready: ensure.isReady,
                auth: ensure.isAuthenticated,
                chat: resolve.chat
            }
        });
    }
])

.controller('Chat', [
    '$scope',
    'chat',
    function($scope, chat) {
        $scope.chat = chat;
    }
]);
