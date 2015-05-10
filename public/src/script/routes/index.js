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
    '$http',
    'profile',
    function($scope, $http, profile) {

        //
        // Setup scope
        //
        $scope.auth = {
            email: "",
            password: ""
        };
        $scope.selectedTab = 0;
        $scope.signup = signup;
        $scope.login = login;
        $scope.results = [];
        $scope.toggle = function() {
            $scope.login = !$scope.login;
            $scope.auth = { email: "", password: "" };
         };
        // $scope.profile gets inherited from $rootScope


        //
        // Functions
        //

        function signup() {
            $scope.profile.$signup($scope.auth).catch(function(err) {
                $scope.error = err;
            })
        }

        function login() {
            $scope.profile.$login($scope.auth).catch(function(err) {
                $scope.error = err;
            });
        }
    }
]);
