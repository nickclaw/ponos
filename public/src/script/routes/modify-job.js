angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve){
        $routeProvider.when('/job/:job/edit', {
            templateUrl: '/static/template/page/modify-job.html',
            controller: 'ModifyJobController',
            resolve: {
                job: resolve.job
            }
        });

        $routeProvider.when('/job', {
            templateUrl: '/static/template/page/modify-job.html',
            controller: 'ModifyJobController',
            resolve: {
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
                function(res) {
                    $location.url('/job/' + res.data._id);
                },
                function() {
                    console.error('TODO');
                }
            );
        }
    }
]);
