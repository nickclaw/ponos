angular.module('scaffold').directive('jobDetails', [
    'Job',
    function(Job) {
        return {
            restrict: 'E',
            templateUrl: '/static/template/directive/job-details.html',
            replace: true,
            scope: {
                _job: '=job'
            },
            link: function($scope, elem, attr) {
                $scope.loading = true;
                $scope.errored = false;
                $scope.job = $scope._job;

                $scope.$watch('job', function(job) {
                    $scope.errored = false;
                    $scope.loading = false;

                    // case: no job
                    if (!job) {
                        $scope.errored = true;
                        return;
                    }

                    // case: just job id
                    if (!job._id) {
                        $scope.loading = true;
                        Job.get({_id: job}).$promise
                            .then(
                                function(j) {
                                    $scope.loading = false;
                                    $scope.errored = false;
                                    $scope.job = j;
                                },
                                function() {
                                    $scope.loading = false;
                                    $scop.errored = true;
                                }
                            );
                        return;
                    }

                    // case: has object
                    // do nothing
                });
            }
        }
    }
]);
