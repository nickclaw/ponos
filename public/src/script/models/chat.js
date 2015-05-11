angular.module('scaffold').factory('Chat', [
    '$resource',
    '$http',
    function($resource, $http) {
        var Chat = $resource(
            '/api/chat/:_id',
            {
                _id: '@_id'
            },
            {
                get: { method: 'GET' },
                search: { method: 'GET', url: '/api/chat', isArray: true }
            }
        );

        Chat.prototype.ack = function() {
            return $http.post('/api/chat/' + this._id + '/ack');
        };

        Chat.prototype.message = function(message) {
            return $http.post('/api/chat/' + this._id, {
                message: message
            });
        };

        return Chat;
    }
]);
