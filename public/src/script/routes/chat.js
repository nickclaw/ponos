angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/messages/:chat', {
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
    'profile',
    function($scope, chat, profile) {
        $scope.chat = chat;
        $scope.profile = profile;
        $scope.messages = clusterMessages();
        $scope.message = "";

        $scope.onSubmit = function() {
            if (!$scope.message.length) return;
            chat.message($scope.message)
                .then(function(req) {
                    $scope.message = "";
                    $scope.chat.messages.unshift(req.data);
                    $scope.messages = clusterMessages();
                });
        };

        function clusterMessages(messages) {
            var clusters = [],
                lastUser = null,
                lastDate = 0;

            chat.messages.forEach(function(m) {
                var currentDate = new Date(m.sent).valueOf();
                if (m.user !== lastUser || lastDate < currentDate - 1000 * 60 * 30) {
                    clusters.unshift([]);
                }
                clusters[0].unshift(m);
                lastUser = m.user;
                lastDate = currentDate;
            });

            return clusters;
        }
    }
]);
