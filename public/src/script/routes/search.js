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
    '$timeout',
    'Job',
    'cats',
    function($scope, $timeout, Job, cats){

        $scope.search = search;
        $scope.searchOptions = {
            search: "",
            category: "",
            sortBy: "start",
            orderBy: "asc"
        };

        $scope.cats = cats;

        $scope.sorts = [
            { text: "", value: undefined },
            { text: "Start", value: "start" },
            { text: "Added", value: "new" },
            { text: "Rate", value: "rate" },
            { text: "Distance", value: "distance" }
        ];

        $scope.orders = [
            { text: "Asc", value: "asc" },
            { text: "Desc", value: "desc" }
        ];

        search();

        function search() {
            $scope.jobs = Job.search($scope.searchOptions);
        }
    }
]);
