angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve){
        $routeProvider.when('/job/:job', {
            templateUrl: '/static/template/page/view-job.html',
            controller: 'ViewJobController',
            resolve: {
                job: resolve.job
            }
        });
    }
])

.controller('ViewJobController', [
    '$scope',
    'job',
    function($scope, job) {
        $scope.job = job;
        $scope.mapOptions = {
            center: job.location.coords,
            zoom: 12
        };
    }
])
