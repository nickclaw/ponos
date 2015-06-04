angular.module('scaffold')

.config([
    '$routeProvider',
    'ensure',
    'resolve',
    function($routeProvider, ensure, resolve) {
        $routeProvider.when('/user/:user/jobs', {
            templateUrl: '/static/template/page/view-jobs.html',
            controller: 'ViewJobs',
            resolve: {
                user: resolve.user
            }
        })
    }
])

.controller('ViewJobs', [
    '$scope',
    '$http',
    'user',
    function($scope, $http, user) {
        $scope.user = user;
        $scope.jobs = [];
        $scope.loading = true;
        $scope.errored = false;

        $http.get('/api/user/' + user._id + '/jobs')
            .then(
                function(res) {
                    $scope.jobs = res.data;
                    $scope.errored = false;
                },
                function() {
                    $scope.errored = true;
                }
            )
            .finally(function() {
                $scope.loading = false;
            });

    }
]);
