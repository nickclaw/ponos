angular.module('scaffold').directive('locationInput', [
    '$http',
    '$timeout',
    function($http, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<input ng-model="location.name" placeholder="Seattle Washington" ng-class="{invalid: location.$error}" />',
            scope: {
                location: '='
            },
            link: function($scope, elem, attr) {
                var currentRequest;

                $scope.$watch('location.name', debounce(600, function(address) {
                    if (!address) {
                        $scope.location.coords = [-122.3300624, 47.6038321];
                        $scope.location.$loading = false;
                        $scope.location.$errored = false;
                        return;
                    };

                    var thisRequest = currentRequest = $http.get('/api/upload/address?address=' + address)
                        .then(
                            function(res) {
                                if (thisRequest !== currentRequest) return;
                                $scope.location.coords = [res.data.longitude, res.data.latitude];
                                $scope.location.$errored = false;
                                $scope.location.$loading = false;
                            },
                            function(err) {
                                if (thisRequest !== currentRequest) return;
                                $scope.location.$error = err;
                                $scope.location.$loading = false;
                                $scope.location.$errored = true;
                            }
                        )
                }));

                function debounce(time, fn) {
                    var timeout;
                    return function() {
                        $scope.location.$loading = true;
                        $scope.location.$errored = false;

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
