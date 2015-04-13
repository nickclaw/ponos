angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve) {
        $routeProvider.when('/job/:job/applications', {
            templateUrl: '/static/template/page/view-applications.html',
            controller: 'ViewApplicationsController',
            resolve: {
                job: resolve.job
            }
        });
    }
])

.controller('ViewApplications', [
    '$scope',
    'job',
    function($scope, job) {

        //
        // Scope
        //
        $scope.job = job;
        $scope.applications = job.$getApplications();
    }
]);
