angular.module('scaffold').factory('UploadCache', [
    '$http',
    function($http) {
        var cache = {};

        return {
            get: function(url, file) {
                var key = getKey(file);
                if (cache[key]) return cache[key];

                var fd = new FormData();
                fd.append('file', file);

                var req = $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })

                    // don't cache on error
                    .then(null, function(reason) {
                        delete cache[key];
                        throw reason;
                    });

                cache[key] = req;
                return req;
            }
        };

        function getKey(file) {
            return file.name + ':' + file.lastModifiedDate;
        }
    }
]);
