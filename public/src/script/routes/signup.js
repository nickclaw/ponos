angular.module('scaffold')

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/signup', {
            templateUrl: '/static/template/page/signup.html',
            controller: 'SignupController'
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
        $scope.goBack = goBack;
        $scope.addExperience = addExperience;
        $scope.removeExperience = removeExperience;
        $scope.save = save;


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

        function goBack() {
            $scope.user.role = null;
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
