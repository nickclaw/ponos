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
        $scope.d = {selectedIndex: 0};
        $scope.signup = signup;
        $scope.login = login;
        $scope.results = [];
        $scope.toggle = function() { $scope.login = !$scope.login };
        // $scope.profile gets inherited from $rootScope

        $scope.$watch('d.selectedIndex', onTabChange);

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

        function onTabChange(index, lastIndex) {
            var profile = $scope.profile,
                role = profile.role;

            $scope.results = [];
            $http.get(indexes[index])
                .then(function(results) {
                    $scope.results = results;
                });
        }

        // how to get tab content
        var indexes = [
            profile.$isWorker() ? '/api/user/me/jobs/accepted' : '/api/user/me/jobs/upcoming',
            profile.$isWorker() ? '/api/user/me/jobs/waiting' : '/api/user/me/jobs/pending',
            '/api/user/me/jobs/review'
        ];
    }
]);
