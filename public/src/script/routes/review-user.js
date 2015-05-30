angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/user/:user/review/:job', {
            templateUrl: '/static/template/page/review-user.html',
            controller: 'ReviewUserController',
            resolve: {
                ready: ensure.isReady,
                authenticated: ensure.isAuthenticated,
                user: resolve.user,
                job: resolve.job
            }
        });
    }
])

.controller('ReviewUserController', [
    '$scope',
    '$http',
    '$location',
    'user',
    'job',
    'handle',
    function($scope, $http, $location, user, job, handle) {

        $scope.user = user;
        $scope.job = job;
        $scope.review = {
            comment: "",
            a: 3,
            b: 3,
            c: 3
        };
        $scope.submit = review;
        $scope.cancel = cancel;

        function review() {
            $scope.errors = {};
            $http.post('/api/user/' + user._id + '/review/?job=' + job._id, $scope.review)
                .then(
                    function() {
                        $location.url('/user/' + user._id);
                    },
                    handle({
                        400: function(res) {
                            $scope.errors = res.data;
                            for (key in $scope.errors) {
                                if ($scope.errors[key].indexOf('String') === 0) {
                                    $scope.errors[key] = $scope.errors[key].substr(7);
                                }
                                if ($scope.errors[key].indexOf('Integer') === 0) {
                                    $scope.errors[key] = $scope.errors[key].substr(8);
                                }
                            }
                        }
                    })
                );
        }

        function cancel() {
            $location.url('/');
        }
    }
]);
