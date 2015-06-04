angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/job/:job/applications/:application', {
            templateUrl: '/static/template/page/view-application.html',
            controller: 'ViewApplicationController',
            resolve: {
                ready: ensure.isReady,
                authenticated: ensure.isAuthenticated,
                application: resolve.application
            }
        });
    }
])

.controller('ViewApplicationController', [
    '$scope',
    '$location',
    '$history',
    'application',
    'profile',
    function($scope, $location, $history, app, profile) {

        //
        // Scope
        //
        $scope.app = app;
        $scope.accept = accept;
        $scope.reject = reject;
        $scope.cancel = cancel;

        var url = profile.$isWorker() ? '/job/' + app.job + '/applications' : '/';

        //
        // Functions
        //

        function accept() {
            app.$accept().then(
                function() {
                    if (profile.$isWorker()) {
                        $location.url('/messages');
                    } else {
                        $history.back(url);
                    }
                },
                function(err) {
                    console.error('TODO');
                }
            );
        }

        function reject() {
            app.$reject().then(
                function() {
                    $history.back(url);
                },
                function(err) {
                    console.error('TODO');
                }
            )
        }

        function cancel() {
            $history.back(url);
        }
    }
]);
