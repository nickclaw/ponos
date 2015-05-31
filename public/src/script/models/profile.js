angular.module('scaffold').factory('profile', [
    '$rootScope',
    '$http',
    '$location',
    'User',
    'io',
    'C',
    function($rootScope, $http, $location, User, io, C) {

        // retrieve user object
        var user = window['__user'];
        delete window['__user'];

        // build user model
        var model = new User(user);
        var profile = Object.create(model);
        var socket = null;

        profile.$loggedIn = !!profile._id;
        profile.$error = null;

        if (profile.$loggedIn) {
            openSocket();
        }

        profile.$login = function(data) {
            return $http.post('/auth/local/login', {email: data.email, password: data.password})
                .then(
                    function(res) {
                        profile.__proto__ = new User(res.data);
                        profile.$error = null;
                        profile.$loggedIn = true;
                        openSocket();
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
                       closeSocket();
                   },
                   function() {
                       profile.__proto__ = new User(null);
                       profile.$error = null;
                       profile.$loggedIn = false;
                       closeSocket();
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
                        $location.url('/signup');
                        openSocket();
                    },
                    function(res) {
                        profile.$loggedIn = false;
                        profile.$error = res;
                        throw res;
                    }
                );
        };

        profile.$acknowledgeNotifications = function() {
            return $http.post('/user/me/notifications');
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

        profile.$on = function() {
            if(socket) socket.on.apply(socket, arguments);
        }

        profile.$off = function() {
            if(socket) socket.off.apply(socket, arguments);
        }

        return profile;

        function openSocket() {
            socket = io.connect(C.SERVER.HOST + ':8081/user/' + profile._id, {
                query: 'ns='+profile._id
            });

            socket.on('notification', function(notification) {
                profile.notifications.push(notification);
                $rootScope.$digest();
            });

            socket.on('message', function(notification) {
                console.log(notification);
            });
        }

        function closeSocket() {
            socket.disconnect();
            socket = null;
        }
    }
])
