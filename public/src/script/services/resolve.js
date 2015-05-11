angular.module('scaffold').constant('resolve', {

    chat: [
        'Chat',
        '$route',
        function(Chat, $route) {
            return Chat.get({_id: $route.current.params.chat}).$promise;
        }
    ],

    job: [
        'Job',
        '$route',
        function(Job, $route) {
            return Job.get({_id: $route.current.params.job}).$promise;
        }
    ],

    user: [
        'User',
        '$route',
        function(User, $route) {
            return User.get({_id: $route.current.params.user}).$promise;
        }
    ],

    application: [
        'Application',
        '$route',
        function(Application, $route) {
            return Application.get({
                job: $route.current.params.job,
                _id: $route.current.params.application
            }).$promise;
        }
    ]
});
