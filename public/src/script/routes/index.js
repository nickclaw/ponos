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
    function($scope, $http) {

        //
        // Setup scope
        //
        $scope.auth = {
            email: "",
            password: ""
        };
        $scope.d = {selectedIndex: 0};
        $scope.signup = signup;
        $scope.results = [];
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
            '/api/user/me/jobs/upcoming',
            '/api/user/me/jobs/pending',
            '/api/user/me/jobs/review'
        ];
    }
]);
