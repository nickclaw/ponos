angular.module('scaffold').directive('datePicker', [
    'moment',
    function(moment) {
        return {
            restrict: "A",
            require: 'ngModel',
            link: function($scope, elem, attr, ngModel) {
                elem.pickadate({
                    onSet: function(evt) {
                        ngModel.$setViewValue(evt.select);
                        ngModel.$render();
                    }
                });
                ngModel.$render = function() {
                    var date = moment(ngModel.$viewValue);
                    if (date.isValid()) {
                        elem[0].value = date.format('MMM DD, YYYY');
                    } else {
                        elem[0].value = "";
                    }
                }
                ngModel.$render();
            }
        };
    }
]);
