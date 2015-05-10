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
                    elem[0].value = moment(ngModel.$viewValue).format('MMM DD, YYYY');
                }
                ngModel.$render();
            }
        };
    }
]);
