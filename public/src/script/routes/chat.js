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
    '$routeParams',
    'chat',
    'Chat',
    'Poller',
    'profile',
    function($scope, $routeParams, chat, Chat, Poller, profile) {
        $scope.chat = chat;
        $scope.profile = profile;
        $scope.messages = clusterMessages(chat.messages);
        $scope.message = "";

        $scope.chat.$ack();
        var poller = new Poller(update);
        poller.start(10000);

        $scope.onSubmit = function() {
            if (!$scope.message.length) return;
            chat.$message($scope.message)
                .then(function(req) {
                    $scope.message = "";
                    $scope.chat.messages.unshift(req.data);
                    $scope.messages = clusterMessages($scope.chat.messages);
                });
        };

        $scope.notUser = function(chat) {
            return chat.users[0] === profile._id ? chat.users[1] : chat.users[0];
        }

        function clusterMessages(messages) {
            var clusters = [],
                lastUser = null,
                lastDate = 0;

            messages.forEach(function(m) {
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

        function update() {
            Chat.get({ _id: chat._id }).$promise.then(function(c) {
                $scope.chat = c;
                $scope.messages = clusterMessages(c.messages);
                c.$ack();
            });
        }
    }
]);
