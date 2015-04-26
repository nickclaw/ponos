angular.module('scaffold').directive('icon', [
    function() {
        return {
            restrict: "E",
            scope: {
                src: "@"
            },
            link: function($scope, elem) {
                var img = new Image();
                img.src = $scope.src;
                img.onload = function() {
                    elem.css('backgroundImage', 'url(' + $scope.src + ')');
                    elem.addClass('loaded');
                    img.onload = null;
                };
            }
        }
    }
]);
