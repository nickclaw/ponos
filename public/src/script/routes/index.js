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
    'handle',
    function($scope, $http, profile, handle) {

        //
        // Setup scope
        //
        $scope.auth = {
            email: "",
            password: ""
        };
        $scope.errors = {};

        $scope.new = false;
        $scope.selectedTab = 0;
        $scope.signup = signup;
        $scope.login = login;
        $scope.results = [];
        // $scope.profile gets inherited from $rootScope


        //
        // Functions
        //

        function signup() {
            $scope.profile.$signup($scope.auth)
                .catch(handle({
                    400: function(res) {
                        if (res.data.email) $scope.errors.email = "must be valid";
                        if (res.data.password) $scope.errors.password = "is required";
                    }
                }));
        }

        function login() {
            $scope.profile.$login($scope.auth)
                .catch(handle({
                    400: function() {
                        if (res.data.email) $scope.errors.email = "must be valid";
                        if (res.data.password) $scope.errors.password = "is required";
                    }
                }));
        }
    }
]);
