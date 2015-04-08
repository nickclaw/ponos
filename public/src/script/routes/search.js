angular.module('scaffold')

.config([
	'$routeProvider', 
	function($routeProvider){
		$routeProvider.when('/search', {
			templateUrl: '/static/template/search.html',
			controller: 'SearchController'
		});
	}
])


.controller('SearchController', [
	'$scope',
	function($scope){
		$scope.hello = 'world';
	}
]);

<div ng-repeat="job in jobs track by $index">
