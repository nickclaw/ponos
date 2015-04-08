angular.module('scaffold')
.factory(
	'User',
	[
	'$resource',
	'Job',
		function($resource, Job){
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
				},
			)

			User.prototype.$getJobs = function(){
				return Job.search({ owner: this._id }); // GET /api/job?owner=:id
			}	
		}
	]
)

// GET /api/user - search
// POST /api/user - create
// GET /api/user/:id - get
// POST /api/user/:id - update
// DELETE /api/user/:id - delete

var users = User.search();

users.$promise.then(function() {


	var user = users[0];

	var jobs = user.$getJobs();
});