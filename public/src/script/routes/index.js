angular.module('scaffold')

.config([
	'$routeProvider',
	function($routeProvider){
		$routeProvider.when('/', {
			templateUrl: '/static/template/page/index.html',
			controller: 'IndexController'
		});
	}
])

.controller('IndexController', [
    '$scope',
    function() {

    }
]);
