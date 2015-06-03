angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/job/:job/apply', {
            templateUrl: '/static/template/page/apply-job.html',
            controller: 'ApplyJobController',
            resolve: {
                authenticated: ensure.isAuthenticated,
                ready: ensure.isReady,
                isWorker: ensure.hasRole('worker'),
                job: resolve.job
            }
        });
    }
])

.controller('ApplyJobController', [
    '$scope',
    '$location',
    '$mdToast',
    'Application',
    'job',
    'handle',
    function($scope, $location, $mdToast, Application, job, handle) {

        //
        // Scope
        //
        $scope.job = job;
        $scope.application = new Application({
            blurb: ""
        });
        $scope.errors = {};

        $scope.apply = apply;
        $scope.cancel = cancel;

        //
        // Functions
        //

        function apply() {
            $scope.errors = {};
            $scope.application.$apply({job: job._id}).then(
                function() {
                    $location.url('/');
                },
                handle({
                    400: function(res) {
                        $scope.errors = res.data;
                        for (key in $scope.errors) {
                            if ($scope.errors[key].indexOf('String') === 0) {
                                $scope.errors[key] = $scope.errors[key].substr(7);
                            }
                        }
                    },
                    403: function(res) {
                        $mdToast.showSimple("You've already applied to this job!");
                    }
                })
            );
        }

        function cancel() {
            $location.url('/job/' + job._id);
        }
    }
])
