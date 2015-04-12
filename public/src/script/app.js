angular.module('scaffold', [
	'ngRoute',
	'ngMaterial',
	'ngResource'
])

.config([
	'$locationProvider',
	function($locationProvider){
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');
	}
])

