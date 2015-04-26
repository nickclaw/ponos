angular.module('scaffold').directive('userDetails', [
    'User',
    function(User) {
        return {
            restrict: 'E',
            templateUrl: '/static/template/directive/user-details.html',
            replace: true,
            scope: {
                user: '='
            },
            link: function($scope, elem, attr) {
                $scope.short = false;
                $scope.loaded = false;
                $scope.errored = false;

                $scope.$watch('user', function(user) {
                    $scope.errored = false;
                    $scope.loaded = true;

                    // case: no user
                    if (!user) {
                        $scope.errored = true;
                        return;
                    }

                    // case: just unique id
                    if (!user._id) {
                        $scope.loaded = false;
                        User.get({_id: user}).$promise
                            .then(
                                function(u) {
                                    $scope.loaded = true;
                                    $scope.user = u;
                                },
                                function() {
                                    $scope.loaded = true;
                                    $scop.errored = true;
                                }
                            );
                        return;
                    }

                    // case: user object!
                    // do nothing..
                });
            }
        };
    }
]);
