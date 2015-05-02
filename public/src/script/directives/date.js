angular.module('scaffold').directive('date', [
    'moment',
    function(moment) {

        return {
            restrict: "AE",
            scope: {
                date: '='
                // format
            },
            link: function($scope, elem, attr) {
                var format = attr.format || "D/M/YY";

                $scope.$watch('date', function(date) {
                    var d = moment(date);
                    elem.text(d.format(format));
                    elem.attr('title', d.format("dddd, MMMM Do YYYY, h:mm:ss a"));
                });
            }
        };
    }
]);
