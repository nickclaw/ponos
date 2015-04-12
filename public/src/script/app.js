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

.run([
    '$rootScope',
    'profile',
    function($rootScope, profile) {
        $rootScope.profile = profile;
    }
]);
