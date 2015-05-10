angular.module('scaffold')

.config([
    '$routeProvider',
    'ensure',
    function($routeProvider, ensure) {
        $routeProvider.when('/signup', {
            templateUrl: '/static/template/page/signup.html',
            controller: 'SignupController',
            resolve: {
                authenticated: ensure.isAuthenticated
            }
        });
    }
])

.controller('SignupController', [
    '$scope',
    '$location',
    'User',
    function($scope, $location, User) {

        //
        // Scope
        //
        $scope.user = new User($scope.profile.__proto__);
        $scope.user.gender = "other";
        $scope.selectedIndex = 0;

        $scope.isEmployer = isEmployer;
        $scope.isWorker = isWorker;
        $scope.back = back;
        $scope.addExperience = addExperience;
        $scope.removeExperience = removeExperience;
        $scope.save = save;
        $scope.currentIndex = 0;


        //
        // Watchers
        //

        $scope.$watch('user.role', function(role) {
            $scope.selectedIndex = role ? (role === 'worker' ? 2 : 1) : 0;
        }, true);


        //
        // Functions
        //

        function isEmployer() {
            $scope.user.role = 'employer';
            $scope.user.employer = {
                bio: "",
                url: ""
            };
        }

        function isWorker() {
            $scope.user.role = 'worker';
            $scope.user.worker = {
                bio: "",
                experience: []
            };
            addExperience();
        }

        function back() {
            $scope.user.role = null;
            $scope.user.worker = $scope.user.employer = null;
        }

        function addExperience() {
            $scope.user.worker.experience.push({
                title: "",
                start: "",
                end: "",
                description: ""
            });
        }

        function removeExperience(index) {
            $scope.user.worker.experience.splice(index, 1);
        }

        function save() {
            $scope.user.$save().then(
                function(res) {
                    var profile = $scope.profile;
                    profile.__proto__ = $scope.user;
                    $location.url(profile.$isWorker() ? "/search" : "/job");
                },
                function(err) {
                    console.error('TODO');
                }
            );
        }
    }
]);
