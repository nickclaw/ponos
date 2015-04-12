angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider){
        $routeProvider.when('/search', {
            templateUrl: '/static/template/search.html',
            controller: 'SearchController'
        });
    }
])


.controller('SearchController', [
    '$scope',
    'Job',
    function($scope, Job){

        $scope.searchOptions = {

        };

        $scope.results = Job.search($scope.searchOptions);
    }
]);
