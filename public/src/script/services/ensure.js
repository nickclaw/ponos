angular.module('scaffold').constant('ensure', {

    isAuthorized: [
        '$q',
        'profile',
        function($q, profile) {
            if (!profile.$loggedIn) return $q.reject("You must be signed in to access that page.");
        }
    ],

    hasRole: function(role) {
        return [
            '$q',
            'profile',
            function($q, profile) {
                if (!profile.$loggedIn) return $q.reject("You must be signed in to access that page.");
                if (profile.role !== role) return $q.reject("Only " + role + "s can access that page."));
            }
        ];
    },

    and: function(before, handler) {
        return [
            '$q',
            '$injector',
            function($q, $injector) {
                try {
                    return $injector.invoke(before)
                        .then(function(value) {
                            return handler(value);
                        });
                } catch (e) {
                    return $q.reject(e);
                }
            }
        ]
    },

    owns: function(handler) {
       return [
           '$q',
           '$injector',
           function($q, $injector) {
               try {
                   return $injector.invoke(handler)
                       .then(function(item) {
                           if (item.$owned()) return item;
                           return $q.reject("You don't have permission to access that page.");
                       });

               } catch (e) {
                   return $q.reject(e);
               }
           }
       ];
   }
});
