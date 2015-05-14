angular.module('scaffold').directive('userDetails', [
    'User',
    function(User) {
        return {
            restrict: 'E',
            templateUrl: '/static/template/directive/user-details.html',
            replace: true,
            scope: {
                _user: '=user'
            },
            link: function($scope, elem, attr) {
                $scope.short = false;
                $scope.loading = true;
                $scope.errored = false;
                $scope.user = $scope._user;
                $scope.stars = null;

                $scope.$watch('user', function(user) {
                    $scope.errored = false;
                    $scope.loading = false;

                    // case: no user
                    if (!user) {
                        $scope.errored = true;
                        return;
                    }

                    // case: just unique id
                    if (!user._id) {
                        $scope.loading = true;
                        User.get({_id: user}).$promise
                            .then(
                                function(u) {
                                    $scope.loading = false;
                                    $scope.errored = false;
                                    $scope.user = u;
                                },
                                function() {
                                    $scope.loading = false;
                                    $scop.errored = true;
                                }
                            );
                        return;
                    }

                    // case: user object!
                    // just retrieve reviews

                    $scope.user.$getReviews().$promise
                        .then(
                            function(review) {
                                if (review.a === null) review.a = 5;
                                if (review.b === null) review.b = 5;
                                if (review.c === null) review.c = 5;
                                $scope.stars = Math.floor((review.a + review.b + review.c) / 3);
                            },
                            function() {
                                console.error('TODO');
                            }
                        )
                });
            }
        };
    }
]);
