'use strict';

//Legals service used for communicating with the legals REST endpoints
angular.module('legals').factory('Legals', ['$resource',
  function ($resource) {
    return $resource('api/legals/:legalId', {
      legalId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
