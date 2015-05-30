angular.module('scaffold')

.config([
    '$routeProvider',
    'resolve',
    'ensure',
    function($routeProvider, resolve, ensure) {
        $routeProvider.when('/user/:user/edit', {
            templateUrl: '/static/template/page/edit-user.html',
            controller: 'EditUserController',
            resolve: {
                ready: ensure.isReady,
                authenticated: ensure.isAuthenticated,
                user: ensure.owns(resolve.user)
            }
        });
    }
])

.controller('EditUserController', [
    '$scope',
    '$location',
    'user',
    'handle',
    function($scope, $location, user, handle) {

        //
        // Scope
        //
        $scope.user = user;
        $scope.errors = {};

        $scope.save = save;

        //
        // Functions
        //

        function save() {
            $scope.errors = {};
            user.$save().then(
                function(u) {
                    $location.url('/user/' + u._id);
                },
                handle({
                    400: function(err) {
                        $scope.errors = err.data;
                        for (key in $scope.errors) {
                            if ($scope.errors[key].indexOf('String') === 0) {
                                $scope.errors[key] = $scope.errors[key].substr(7);
                            }
                        }
                    }
                })
            )
        }

        function cancel() {
            $location.url('/user/' + u._id);
        }
    }
]);
