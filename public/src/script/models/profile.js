angular.module('scaffold').factory('profile', [
    '$http',
    '$location',
    'User',
    function($http, $location, User) {

        // retrieve user object
        var user = delete window['__user'];

        // build user model
        var model = new User(user);
        var profile = Object.create(model);

        profile.$loggedIn = !!profile._id;
        profile.$error = null;

        profile.$login = function(email, password) {
            return $http.post('/auth/local/login', {email: email, password: password})
                .then(
                    function(res) {
                        profile.__proto__ = new User(res.data);
                        profile.$error = null;
                        profile.$loggedIn = true;
                    },
                    function(res) {
                        profile.$loggedIn = false;
                        profile.$error = res;
                        throw res;
                    }
                );
        };

        profile.$logout = function() {
            return $http.post('/auth/logout')
               .then(
                   function() {
                       profile.__proto__ = new User(null);
                       profile.$error = null;
                       profile.$loggedIn = false;
                       $location.url('/');
                   },
                   function() {
                       profile.__proto__ = new User(null);
                       profile.$error = null;
                       profile.$loggedIn = false;
                   }
               );
        };

        profile.$signup = function(data) {
            return $http.post('/auth/local/signup', data)
                .then(
                    function(res) {
                        profile.__proto__ = new User(res.data);
                        profile.$error = null;
                        profile.$loggedIn = true;
                    },
                    function(res) {
                        profile.$loggedIn = false;
                        profile.$error = res;
                        throw res;
                    }
                );
        };

        profile.$getUpcoming = function() {
            return [];
        };

        profile.$getOpen = function() {
            return [];
        };

        profile.$getAccepted = function() {
            return [];
        };

        profile.$getPending = function() {
            return [];
        };

        profile.$getReviewable = function() {
            return [];
        };

        profile.$getSomething = function() {
            return [];
        };

        return profile;
    }
])
