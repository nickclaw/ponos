angular.module('scaffold')

.config([
    '$routeProvider',
    'ensure',
    function($routeProvider, ensure) {
        $routeProvider.when('/signup', {
            templateUrl: '/static/template/page/signup.html',
            controller: 'SignupController',
            resolve: {
                authenticated: ensure.isAuthenticated
            }
        });
    }
])

.controller('SignupController', [
    '$scope',
    '$location',
    'User',
    function($scope, $location, User) {

        //
        // Scope
        //
        $scope.user = new User($scope.profile.__proto__);
        $scope.save = save;

        function save() {
            $scope.user.$save().then(
                function(res) {
                    var profile = $scope.profile;
                    profile.__proto__ = $scope.user;
                    $location.url(profile.$isWorker() ? "/search" : "/job");
                },
                function(err) {
                    console.error('TODO');
                }
            );
        }
    }
]);
