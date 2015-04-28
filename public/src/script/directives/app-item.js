angular.module('scaffold').directive('appItem', [
	function(){
		return {
			restrict:'E',
			replace: true,
			transclude: true,
			scope: {
				app: '='
			},
			templateUrl:'/static/template/directive/app-item.html'
		}
	}
]);
