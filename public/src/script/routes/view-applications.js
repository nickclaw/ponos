angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/job/:job/applications', {
            templateUrl: '/static/template/page/view-applications.html',
            controller: 'ViewApplicationsController',
            resolve: {
                ready: ensure.isReady,
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
