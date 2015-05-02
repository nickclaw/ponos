angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve) {
        $routeProvider.when('/job/:job/applications', {
            templateUrl: '/static/template/page/view-applications.html',
            controller: 'ViewApplicationsController',
            resolve: {
                authenticated: ensure.isAuthenticated,
                isEmployer: ensure.hasRole('employer'),
                job: ensure.owns(resolve.job)
            }
        });
    }
])

.controller('ViewApplicationsController', [
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
