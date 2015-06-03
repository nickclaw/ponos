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
                    'moment',
                    function(Job, moment) {
                        return new Job({
                            new: true,
                            location: {
                                name: "",
                                lat: 47.6038321,
                                long: -122.3300624
                            },
                            start: moment().utc(),
                            end: moment().utc()
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
    '$history',
    'job',
    'handle',
    function($scope, $location, $history, job, handle) {

        //
        // Scope
        //
        $scope.job = job;
        $scope.errors = {};

        $scope.save = save;
        $scope.cancel = onCancel;
        $scope.mapOptions = {};
        $scope.start = {date: job.start, time: job.start};
        $scope.end = {date: job.end, time: job.end};
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
            $scope.errors = {};
            $scope.job.$save().then(
                function(job) {
                    $location.url('/job/' + job._id);
                },
                handle({
                    400: function(res) {
                        $scope.errors = res.data;
                        if (res.data.location) {
                            $scope.errors.locationName = res.data.location.name || "is invalid";
                        }
                        for (key in $scope.errors) {
                            if (typeof $scope.errors[key] !== "string") continue;

                            if ($scope.errors[key].indexOf('String') === 0) {
                                $scope.errors[key] = $scope.errors[key].substr(7);
                            }

                            if ($scope.errors[key].indexOf('Field') === 0) {
                                $scope.errors[key] = $scope.errors[key].substr(6);
                            }
                        }
                    }
                })
            );
        }

        function onCancel() {
            $history.back('/job/' + job._id);
        }
    }
]);
