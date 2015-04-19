angular.module('scaffold')
.factory('User', [
    '$resource',
    '$rootScope',
    'Job',
    function($resource, $rootScope, Job) {
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

        User.prototype.$owned = function() {
            return $rootScope.profile && $rootScope.profile._id === this._id;
        }

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
            return this.role === 'worker';
        };

        User.prototype.$isEmployer = function() {
            return this.role === 'employer';
        };

        User.prototype.$isNew = function() {
            return !this.role || this.new;
        }

        return User;
    }
]);
