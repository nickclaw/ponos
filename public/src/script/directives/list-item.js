angular.module('scaffold')
	.directive(
		'listItem',
		[
		function(){

			return {
				restrict:'E',
				replace:'true',
				templateUrl:'/static/template/directive/list-item.html',
				scope:{
					item:'=obj',
					type:'@'
				}
			}
		}
	])