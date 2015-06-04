angular.module('scaffold').directive('mapView', [
    'leaflet',
    function(leaflet) {
        return {
            restrict: "E",
            template: "<div class='map-view'><div class='map'></div><ng-transclude></ng-transclude></div>",
            transclude: true,
            scope: {
                coords: '=',
                zoom: "="
            },
            link: function($scope, elem, attr) {
                var map = new leaflet.Map(elem.find('.map')[0]);
                var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
                var osm = new leaflet.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});
                map.addLayer(osm);
                map.setView(new leaflet.LatLng($scope.coords[1] || 0, $scope.coords[0] || 0), $scope.zoom || 9);
            }
        };
    }
]);
