angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure){
        $routeProvider.when('/job/:job/edit', {
            templateUrl: '/static/template/page/modify-job.html',
            controller: 'ModifyJobController',
            resolve: {
                authenticated: ensure.isAuthenticated,
                isEmployer: ensure.hasRole('employer'),
                job: ensure.owns(resolve.job)
            }
        });

        $routeProvider.when('/job', {
            templateUrl: '/static/template/page/modify-job.html',
            controller: 'ModifyJobController',
            resolve: {
                isEmployer: ensure.hasRole('employer'),
                job: [
                    'Job',
                    function(Job) {
                        return new Job({

                        });
                    }
                ]
            }
        })
    }
])

.controller('ModifyJobController', [
    '$scope',
    '$location',
    'job',
    function($scope, $location, job) {

        //
        // Scope
        //
        $scope.job = job;

        $scope.save = save;


        //
        // Functions
        //

        function save() {
            $scope.job.$save().then(
                function(job) {
                    $location.url('/job/' + job._id);
                },
                function() {
                    console.error('TODO');
                }
            );
        }
    }
]);
