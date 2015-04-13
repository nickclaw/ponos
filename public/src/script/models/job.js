angular.module('scaffold').factory('Job', [
    '$resource',
    'Application',
    function($resource, Application) {

        var Job = $resource(
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

        Job.prototype.$getApplications = function(options) {
            return Application.browse({
                job: this._id
            }, options);
        };

        Job.prototype.$apply = function(data) {
            data.job = this._id;
            return Application.create(data);
        };

        return Job;
    }
]);
