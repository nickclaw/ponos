angular.module('scaffold').directive('locationInput', [
    '$http',
    '$timeout',
    function($http, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<input ng-model="location.name" ng-class="{invalid: location.$error}" />',
            scope: {
                location: '='
            },
            link: function($scope, elem, attr) {
                var currentRequest;

                $scope.$watch('location.name', debounce(600, function(address) {
                    if (!address) return;
                    $scope.location.$resolved = false;
                    var thisRequest = currentRequest = $http.get('/api/upload/address?address=' + address)
                        .then(
                            function(res) {
                                if (thisRequest !== currentRequest) return;
                                $scope.location.lat = res.data.latitude;
                                $scope.location.long = res.data.longitude;
                                $scope.location.error = null;
                                $scope.location.$resolved = false;
                            },
                            function(err) {
                                if (thisRequest !== currentRequest) return;
                                $scope.location.$error = err;
                                $scope.location.lat = 0;
                                $scope.location.long = 0;
                                $scope.location.$resolved = false;
                            }
                        )
                }));

                function debounce(time, fn) {
                    var timeout;
                    return function() {
                        if (timeout) {
                            $timeout.cancel(timeout);
                        }
                        var args = arguments;
                        timeout = $timeout(function() {
                            fn.apply(null, args);
                            timeout = null;
                        }, time);
                    };
                }
            }
        };
    }
]);
