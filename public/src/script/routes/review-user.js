angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve) {
        $routeProvider.when('/user/:user/review/:job', {
            templateUrl: '/static/template/page/review-user.html',
            controller: 'ReviewUserController',
            resolve: {
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
    function($scope, $http, $location, user, job) {

        $scope.user = user;
        $scope.job = job;
        $scope.review = {
            comment: "",
            a: 0,
            b: 0,
            c: 0
        };
        $scope.submit = review;
        $scope.cancel = cancel;

        function review() {
            $http.post('/api/user/' + user._id + '/review/?job=' + job._id, $scope.review)
                .then(
                    function() {
                        $location.url('/user/' + user._id);
                    },
                    function() {
                        console.error('TODO');
                    }
                );
        }

        function cancel() {
            $location.url('/');
        }
    }
]);
