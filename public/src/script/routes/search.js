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
    '$mdToast',
    'Job',
    'cats',
    'geo',
    function($scope, $timeout, $mdToast, Job, cats, geo){

        $scope.loading = false;

        $scope.search = search;
        $scope.cancel = cancel;
        $scope.searchOptions = {
            search: "",
            category: "",
            sortBy: "start",
            orderBy: "asc",
            lat: undefined,
            long: undefined
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

        $scope.$watch('searchOptions.sortBy', function(sort) {
            if (sort !== 'distance') return;

            $scope.loading = true;
            $scope.cancelled = false;

            geo().then(
                function(coords) {
                    if ($scope.cancelled) return;
                    $scope.loading = false;
                    $scope.searchOptions.lat = coords.coords.latitude;
                    $scope.searchOptions.long = coords.coords.longitude;
                },
                function(err) {
                    if ($scope.cancelled) return;
                    $scope.loading = false;
                    $scope.searchOptions.sortBy = "start";
                    $mdToast.showSimple("Could not get your location.");
                }
            );
        });

        function cancel() {
            $scope.cancelled = true;
            $scope.loading = false;
            $scope.searchOptions.sortBy = "start";
            $mdToast.showSimple("Could not get your location.");
        }

        function search() {
            $scope.jobs = Job.search($scope.searchOptions);
        }
    }
]);
