angular.module('scaffold')

.config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider.when('/job/:job/edit', {
			templateUrl: '/static/template/page/modify-job.html',
			controller: 'ModifyJobController'
		});

        $routeProvider.when('/job', {
            templateUrl: '/static/template//pagemodify-job.html',
            controller: 'ModifyJobController'
        })
	}
])

.controller('ModifyJobController', [
    '$scope',
    function($scope) {

    }
])
