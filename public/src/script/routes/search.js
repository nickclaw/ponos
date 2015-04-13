angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider){
        $routeProvider.when('/search', {
            templateUrl: '/static/template/page/search.html',
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

        $scope.jobs = Job.search($scope.searchOptions);
    }
]);
