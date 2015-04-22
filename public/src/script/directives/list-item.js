angular.module('scaffold')
	.directive(
		'listItem',
		[
		function(){

			return {
				restrict:'E',
				replace:'true',
				transclude:'true',
				scope:'true',
				templateUrl:'/static/template/directive/list-item.html',
				link: function ($scope) {
					console.log($scope);
				}
			}
		}
	]);