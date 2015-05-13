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
                ready: ensure.isReady,
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
                            location: {
                                name: "",
                                lat: 0,
                                long: 0
                            }
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
        $scope.mapOptions = {};
        $scope.start = {date: "", time: ""};
        $scope.end = {date: "", time: ""};
        $scope.$watch('job.location', onLocationChange, true);
        $scope.$watch('start', onStartChange, true);
        $scope.$watch('end', onEndChange, true);

        //
        // Functions
        //

        function onStartChange(start) {
            job.start = new Date(start.date + start.time).toJSON();
        }

        function onEndChange(end) {
            job.end = new Date(end.date + end.time).toJSON();
        }

        function onLocationChange(loc) {
            $scope.mapOptions = {
                center: {
                    lat: loc.lat,
                    lon: loc.long
                },
                zoom: 11
            };
        }

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
