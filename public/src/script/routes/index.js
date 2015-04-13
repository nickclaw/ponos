angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider){
        $routeProvider.when('/', {
            templateUrl: '/static/template/page/index.html',
            controller: 'IndexController'
        });
    }
])

.controller('IndexController', [
    '$scope',
    function($scope) {

        //
        // Setup scope
        //
        $scope.auth = {
            email: "",
            password: ""
        };
        $scope.signup = signup;


        //
        // Functions
        //

        function signup() {
            $scope.profile.$signup($scope.auth).catch(function(err) {
                $scope.error = err;
            })
        }
    }
]);
