angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider){
        $routeProvider.when('/job/:job', {
            templateUrl: '/static/template/page/view-job.html',
            controller: 'ViewJobController'
        });
    }
])

.controller('ViewJobController', [
    '$scope',
    function($scope) {

    }
])
