angular.module('scaffold').directive('jobList', [
    '$http',
    function($http) {
        return {
            restrict: 'E',
            templateUrl: '/static/template/directive/job-list.html',
            replace: true,
            transclude: true,
            scope: {
                endpoint: '@',
                action: '&'
            },
            link: function($scope, elem, attr) {

                $scope.jobs = [];
                $scope.loaded = false;
                $scope.errored = false;
                $scope.makeUrl = function(job) {
                    return $scope.action({
                        job: job
                    });
                };

                $http.get($scope.endpoint).then(
                    function(res) {
                        $scope.jobs = res.data;
                        $scope.loaded = true;
                        $scope.errored = false;
                    },
                    function(err) {
                        console.error('TODO');
                        $scope.loaded = true;
                        $scope.errored = true;
                    }
                );
            }
        };
    }
]);
