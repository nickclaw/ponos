angular.module('scaffold').directive('onEnter', [
    function() {
        return {
            restrict: 'A',
            scope: {
                'onEnter': '&'
            },
            link: function($scope, elem, attr) {
                elem.on('keypress', function(evt) {
                    if (evt.keyCode === 13) $scope.onEnter();
                });
            }
        };
    }
]);
