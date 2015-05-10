angular.module('scaffold').factory('leaflet', [
    function() {
        var leaflet = window['L'];
        window['L'] = null;
        return leaflet;
    }
]);
