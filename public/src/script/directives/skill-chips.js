angular.module('scaffold').directive('skillChips', [
    function() {
        return {
            restrict: 'E',
            templateUrl: "/static/template/directive/skill-chips.html",
            scope: {
                user: '='
            },
            link: function($scope) {
                $scope.querySearch = querySearch;

                var skills = [
                    "painting",
                    "roofing",
                    "electrical work",
                    "demolition work",
                    "carpentry",
                    "plumbing",
                    "moving",
                    "landscaping",
                    "house-cleaning",
                    "cooking"
                ];

                /**
                * Search for skills.
                */
                function querySearch (query) {
                    var results = query ? skills.filter(createFilterFor(query)) : [];
                    return results;
                }
                /**
                * Create filter function for a query string
                */
                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(skill) {
                        return (angular.lowercase(skill).indexOf(lowercaseQuery) === 0);
                    };
                }
            }
        };
    }
]);
