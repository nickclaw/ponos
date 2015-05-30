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
    'profile',
    'handle',
    function($scope, $routeParams, chat, Chat, profile, handle) {
        $scope.chat = chat;
        $scope.errors = {};

        $scope.profile = profile;
        $scope.messages = clusterMessages(chat.messages);
        $scope.message = "";

        $scope.chat.$ack();

        profile.$on('message', onNewMessage);
        $scope.$on('$destroy', function() {
            profile.$off('message', onNewMessage);
        });

        $scope.onSubmit = function() {
            $scope.errors = {};
            if (!$scope.message.length) return;

            chat.$message($scope.message)
                .then(
                    function(req) {
                        $scope.message = "";
                        $scope.chat.messages.unshift(req.data);
                        $scope.messages = clusterMessages($scope.chat.messages);
                    },
                    handle({
                        400: function(res) {
                            $scope.errors = res.data;
                            for (key in $scope.errors) {
                                if ($scope.errors[key].indexOf('String') === 0) {
                                    $scope.errors[key] = $scope.errors[key].substr(7);
                                }
                            }
                        }
                    })
                );
        };

        $scope.notUser = function(chat) {
            return chat.users[0] === profile._id ? chat.users[1] : chat.users[0];
        }

        function onNewMessage(message) {
            if (message.chat !== chat.id) return;

            $scope.chat.messages.unshift(message);
            $scope.messages = clusterMessages($scope.chat.messages);
            $scope.chat.$ack();
            $scope.$digest();
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
    }
]);
