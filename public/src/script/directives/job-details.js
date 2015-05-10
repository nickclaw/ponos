angular.module('scaffold').directive('jobDetails', [
    'Job',
    function(Job) {
        return {
            restrict: 'E',
            templateUrl: '/static/template/directive/job-details.html',
            scope: {
                _job: '=job'
            },
            link: function($scope, elem, attr) {
                $scope.loaded = true;
                $scope.errored = false;
                $scope.job = $scope._job;

                $scope.$watch('job', function(job) {
                    $scope.errored = false;
                    $scope.loaded = true;

                    // case: no job
                    if (!job) {
                        $scope.errored = true;
                        return;
                    }

                    // case: just job id
                    if (!job._id) {
                        $scope.loaded = false;
                        Job.get({_id: job}).$promise
                            .then(
                                function(j) {
                                    $scope.loaded = true;
                                    $scope.job = j;
                                },
                                function() {
                                    $scope.loaded = true;
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
