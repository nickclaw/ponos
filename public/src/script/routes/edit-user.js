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
    function($scope, $location, user) {

        //
        // Scope
        //
        $scope.user = user;
        $scope.save = save;

        //
        // Functions
        //

        function save() {
            user.$save().then(
                function(u) {
                    $location.url('/user/' + u._id);
                },
                function(err) {
                    console.log('TODO');
                }
            )
        }

        function cancel() {
            $location.url('/user/' + u._id);
        }
    }
]);
