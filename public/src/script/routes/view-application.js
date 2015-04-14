angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    function($routeProvider, resolve) {
        $routeProvider.when('/job/:job/applications/:application', {
            templateUrl: '/static/template/page/view-application.html',
            controller: 'ViewApplicationController',
            resolve: {
                application: resolve.application
            }
        });
    }
])

.controller('ViewApplicationController', [
    '$scope',
    '$location',
    'application',
    function($scope, $location, app) {

        //
        // Scope
        //
        $scope.app = app;

        $scope.accept = accept;
        $scope.reject = reject;
        $scope.cancel = cancel;

        //
        // Functions
        //

        function accept() {
            app.$accept().then(
                function() {
                    $location.url('/job/' + app.job + '/applications');
                },
                function(err) {
                    console.error('TODO');
                }
            );
        }

        function reject() {
            app.$reject().then(
                function() {
                    $location.url('/job/' + app.job + '/applications');
                },
                function(err) {
                    console.error('TODO');
                }
            )
        }

        function cancel() {
            $location.url('/job/' + app.job._id + '/applications');
        }
    }
]);
