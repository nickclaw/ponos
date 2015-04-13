angular.module('scaffold').constant('resolve', {

    job: [
        'Job',
        '$route',
        'request',
        function(Job, $route, req) {
            return Job.get({_id: $route.current.params.id}).$promise
                .then(null, req.handle());
        }
    ],

    user: [
        'User',
        '$route',
        'request',
        function(User, $route, req) {
            return User.get({_id: $route.current.params.id}).$promise
                .then(null, req.handle());
        }
    ]
});
