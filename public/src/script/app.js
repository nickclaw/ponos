angular.module('scaffold', [
    'ngRoute',
    'ngMaterial',
    'ngResource'
])

.config([
    '$locationProvider',
    '$mdThemingProvider',
    function($locationProvider, $mdThemingProvider){
        $locationProvider
            .html5Mode(true)
            .hashPrefix('!');

        //Extend the default palettes to include our branding colors
        var scaffoldBlueMap = $mdThemingProvider.extendPalette('blue', {
            '500': '009AB0'
        });
        $mdThemingProvider.definePalette('scaffoldBlue', scaffoldBlueMap);
        var scaffoldOrangeMap = $mdThemingProvider.extendPalette('orange', {
            '500': 'F7911E'
        });
        $mdThemingProvider.definePalette('scaffoldOrange', scaffoldOrangeMap);
        var scaffoldGreyMap = $mdThemingProvider.extendPalette('grey', {
            '500': '808080'
        });
        $mdThemingProvider.definePalette('scaffoldGrey', scaffoldGreyMap);

        $mdThemingProvider
            .theme('default')
            .warnPalette('scaffoldBlue')
            .accentPalette('scaffoldOrange')
            .primaryPalette('scaffoldGrey');
    }
])

.run([
    '$rootScope',
    '$mdSidenav',
    '$mdDialog',
    '$timeout',
    '$history',
    'profile',
    function($rootScope, $mdSidenav, $mdDialog, $timeout, $history, profile) {
        $rootScope.profile = profile;

        $rootScope.filter = function(item){ return !item.seen; }

        $rootScope.toggleNav = function() {
           $mdSidenav('nav').toggle();
        };

        // close sideNav on route change
        $rootScope.$on('$routeChangeStart', function() {
           $mdSidenav('nav').close();
        });

        // Make alert on routeChangeError
        $rootScope.$on('$routeChangeError', function(evt, state, oldState, reason) {
            $history.back('/');
            var alert = $mdDialog.alert()
                .title("Error")
                .content(reason)
                .ok("OK");

            $mdDialog.show(alert);
        });

        // make splash screen disappear
        $timeout(function() {
            document.getElementById('splash').classList.add('ready');
        }, 300);
    }
]);
