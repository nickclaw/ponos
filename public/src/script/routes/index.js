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

            if (!role) return;

            $scope.results = [];
            $http.get(indexes[role][index])
                .then(function(results) {
                    $scope.results = results;
                });
        }

        // how to get tab content
        var indexes = {
            worker: [
                '/api/user/me/my',
                '/api/user/me/pending',
                '/api/user/me/review'
            ],
            employer: [
                '/api/user/me/filled',
                '/api/user/me/open',
                '/api/user/me/review'
            ]
        }
    }
]);
