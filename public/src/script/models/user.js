angular.module('scaffold')
.factory('User', [
    '$resource',
    'Job',
    function($resource, Job) {
        var User = $resource(
            '/api/user/:_id',
            {
                _id:'@_id'
            },
            {
                get: {method: 'GET'},
                save: {method: 'POST'},
                delete: {method: 'DELETE'},
                search: {method: 'GET', url: '/api/user', isArray: 'true'}
            }
        );

        var Reviews = $resource(
            '/api/user/:_id/review',
            {},
            {
                get: { method: 'GET' },
                create: { method: 'POST' }
            }
        );

        User.prototype.$getJobs = function(){
            return Job.search({ owner: this._id }); // GET /api/job?owner=:id
        }

        User.prototype.$getReviews = function() {
            return Reviews.get({_id: this._id});
        }

        User.prototype.$review = function(review) {
            return Reviews.create(review);
        }

        User.prototype.$isWorker = function() {
            return true;
        };

        User.prototype.$isEmployer = function() {
            return true;
        };

        return User;
    }
]);
