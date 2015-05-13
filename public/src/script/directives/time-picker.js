angular.module('scaffold').directive('timePicker', [
    'moment',
    function(moment) {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function($scope, elem, attr, ngModel) {
                elem.pickatime({
                    onSet: function(evt) {
                        ngModel.$setViewValue(evt.select * 1000 * 60);
                        ngModel.$render();
                    }
                });

                var now = new Date();
                now.setMinutes(0);
                now.setSeconds(0);
                now.setHours(0);

                ngModel.$render = function() {
                    var date = moment(ngModel.$viewValue);
                    if (date.isValid()) {
                        elem[0].value = date.format('h:mm a');
                    } else {
                        elem[0].value = "";
                    }
                }
                ngModel.$render();
            }
        };
    }
]);
