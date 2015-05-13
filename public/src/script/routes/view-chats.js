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
    'profile',
    function($scope, Chat, profile) {
        $scope.errored = false;

        $scope.chats = Chat.search();
        $scope.chats.$promise.catch(function() {
            $scope.errored = true;
        });
        
        $scope.notUser = function(chat) {
            return chat.users[0]._id === profile._id ? chat.users[1] : chat.users[0];
        };
    }
]);
