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
    'handle',
    function($scope, $location, User, handle) {

        //
        // Scope
        //
        $scope.user = new User($scope.profile.__proto__);
        $scope.errors = {};

        $scope.save = save;

        function save() {
            $scope.errors = {};
            $scope.user.$save()
                .then(
                    function(res) {
                        var profile = $scope.profile;
                        profile.__proto__ = $scope.user;
                        $location.url(profile.$isWorker() ? "/search" : "/job");
                    },
                    handle({
                        400: function(res) {
                            $scope.errors = res.data;
                            for (key in $scope.errors) {
                                if ($scope.errors[key].indexOf('String') === 0) {
                                    $scope.errors[key] = $scope.errors[key].substr(7);
                                }
                            }
                        }
                    })
                );
        }
    }
]);
