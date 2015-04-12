angular.module('scaffold').factory([
    '$resource',
    'Application',
    function($resource, Application) {

        var job = $resource(
            '/api/job/:_id',
            {
                _id: '@_id'
            },
            {
                get: { method: 'GET' },
                save: { method: 'POST' },
                delete: { method: 'DELETE' },
                create: { method: 'POST', url: '/api/job' },
                search: { method: 'GET', url: '/api/job', isArray: true }
            }
        );

        job.prototype.$getApplications = function(options) {
            return Application.search({
                job: this._id
            }, options);
        };

        job.prototype.$apply = function(data) {
            data.job = this._id;
            return Application.create(data);
        };

        return job;
    }
]);
