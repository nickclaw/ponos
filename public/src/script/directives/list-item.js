angular.module('scaffold').directive('listItem', [
	function(){
		return {
			restrict:'E',
			replace: true,
			transclude: true,
			scope: {
				job: '='
			},
			templateUrl:'/static/template/directive/list-item.html'
		}
	}
]);
