'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);


//Service to retrieve selected product
angular.module('users').factory('UServices', ['$http', '$q', '$filter', 'Users',
  function ($http, $q, $filter, Users) {
    return {

      sendactivationmail: function sendactivationmail(eMail){
        console.log('authentication.client.service - Start Send activation eMail ' +eMail);

        var deferred = $q.defer();
        var currentDate = new Date();

        $http.post('/api/auth/sendactivateemail', {
          usereMail: eMail,
          userDate: $filter('date')(currentDate, 'short', 'de_DE')

        }).success(function(data, status, headers, config) {
          console.log('authentication.client.service - sendactivationmail - success ' +data.activateURL);
          deferred.resolve(data.activateURL);
          return deferred.promise;
        });

      },

      getUser: function getUser(activateId){
        console.log('authentication.client.service - Start getUser ' +activateId);

        Users.get({
          activateURL: activateId
        }).$promise.then(function(ourUser) {
          console.log('authentication.client.service - getUser sussess: ' +ourUser._id);
        }
        );

        /*$http.get('/api/auth/user/:activateURL', {
          activateURL: activateId

        }).success(function(data, status, headers, config) {
          return data;
        });*/
      }

    };
  }
]);
