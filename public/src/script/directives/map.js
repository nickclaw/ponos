angular.module('scaffold').directive('map', [
    'leaflet',
    function(leaflet) {
        return {
            restrict: "E",
            scope: {
                options: "="
            },
            link: function($scope, elem, attr) {
                leaflet.map(elem[0], $scope.options);
            }
        };
    }
]);
