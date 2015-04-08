angular.module('scaffold', ['ngRoute','ngMaterial','ngResource']);
angular.module('scaffold').config([
	'$locationProvider',
	function($locationProvider){
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');
	}
])