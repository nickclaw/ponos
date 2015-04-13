angular.module('scaffold')
	.directive(
		'listItem',
		[
		function(){

			return {
				restrict:'E',
				templateUrl:'',
				scope:{
					item:'=obj',
					onChange:'&',
					type:'@'
				},
				transclude: true,
				link: function($scope, elem, attr) {

					$scope.item === obj;

					$scope.onChange();

					$scope.type === 'jobpost';

					$scope.$watch('item.id', function(newId, oldId) {

					});

					document.addEventListener('load', function() {
						$scope.src = "asdfasfds";
						$scope.$digest();
					});
				}
			}
		}
	])