angular.module('scaffold').directive('loading', [
    function() {
        return {
            restrict: "E",
            templateUrl: '/static/template/directive/loading.html',
            transclude: true,
            replace: true,
            scope: {
                loading: '=',
                error: '='
            }
        }
    }
]);
