angular.module('scaffold').factory('Application', [
    '$resource',
    '$rootScope',
    function($resource, $rootScope) {

        var application = $resource(
            '/api/job/:job/application/:_id',
            {
                _id: '@_id',
                job: '@job'
            },
            {
                apply: { method: 'POST', url: '/api/job/:job/application' },
                browse: { method: 'GET', url: '/api/job/:job/application' },
                accept: { method: 'POST', url: '/api/job/:job/application/:_id/accept' },
                reject: { method: 'POST', url: '/api/job/:job/application/:_id/reject' },
                withdraw: { method: 'POST', url: '/api/job/:job/application/:_id/withdraw' }
            }
        );

        return application;
    }
]);
